#!/usr/bin/env bash
# Installed by a human as /usr/local/sbin/portfolio-deploy; never self-updated.
set -Eeuo pipefail
umask 077
export PATH="/usr/local/node-v22/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export PM2_HOME=/root/.pm2
export GIT_TERMINAL_PROMPT=0

readonly CHECKOUT=/root/projects/personal-blog-nextjs
readonly RELEASES=/root/projects/portfolio-releases
readonly ENV_FILE=/etc/portfolio-deploy/production.env
readonly NODE_FILE=/etc/portfolio-deploy/node-path
readonly PM2_HELPER=/usr/local/lib/portfolio-deploy/pm2-state.cjs
readonly LOCK_FILE=/run/lock/portfolio-deploy.lock
readonly GAID=G-E4G1QVX7T9
export GAID

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
[[ $# == 1 && "$1" =~ ^[a-f0-9]{40}$ ]] || fail 'Expected one full commit SHA.'
readonly SHA="$1"
[[ $(id -u) == 0 ]] || fail 'Use the installed deployment command as root.'
test -r "$NODE_FILE" || fail 'Missing pinned Node runtime; rerun the reviewed installer.'
runtime_node=$(< "$NODE_FILE")
[[ "$runtime_node" == /* && -x "$runtime_node" ]] || fail 'The installed Node runtime no longer exists; rerun the installer.'
runtime_bin=$(dirname -- "$runtime_node")
export PATH="$runtime_bin:$PATH"
"$runtime_node" -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 12)) {
    console.error("Deployment requires Node.js >=22.12.0; rerun the installer with the intended Node in PATH.");
    process.exit(1);
  }
  console.log("Deployment Node runtime:", process.version, process.execPath);
'
for tool in git node npm pm2 curl ss flock; do
  command -v "$tool" >/dev/null || fail "Missing tool: $tool"
done
test -r "$ENV_FILE" || fail 'Missing private production environment.'
test -r "$PM2_HELPER" || fail 'Missing installed PM2 helper.'

exec 9>"$LOCK_FILE"
flock -n 9 || fail 'Another deployment is running.'
cd "$CHECKOUT"
[[ $(git remote get-url origin) == git@github.com:atheodosiou/personal-blog-nextjs.git ]] || fail 'Unexpected repository origin.'

check_head() {
  # The repository is public. HTTPS avoids depending on the interactive SSH
  # session's agent when this runs as an independent systemd service.
  git fetch --no-tags https://github.com/atheodosiou/personal-blog-nextjs.git \
    refs/heads/master:refs/remotes/origin/master
  [[ $(git rev-parse refs/remotes/origin/master) == "$SHA" ]] ||
    fail 'The branch changed. Run the workflow again for its latest commit.'
}
check_head

attempt_dir=$(mktemp -d "$RELEASES/deploy-${SHA:0:12}.XXXXXX")
rollback_config="$attempt_dir/portfolio.rollback.config.json"
release_config="$attempt_dir/portfolio.release.config.json"
previous_dir=$(node "$PM2_HELPER" capture "$rollback_config" "$CHECKOUT" "$RELEASES")
printf 'Previous release: %s\nRollback configuration: %s\n' "$previous_dir" "$rollback_config"

preview_pid=''
switching=0
stop_preview() {
  if [[ -n "$preview_pid" ]]; then
    kill "$preview_pid" 2>/dev/null || true
    wait "$preview_pid" 2>/dev/null || true
    preview_pid=''
  fi
}
wait_http() {
  local port="$1"
  for _ in {1..30}; do
    if [[ "$port" == 3201 ]] && ! kill -0 "$preview_pid" 2>/dev/null; then
      return 1
    fi
    if curl -fsS --max-time 2 "http://127.0.0.1:$port/" -o /dev/null 2>/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}
on_failure() {
  local status="$1"
  trap - ERR HUP INT TERM
  set +e
  stop_preview
  if [[ "$switching" == 1 ]]; then
    printf '\nDeployment failed; restoring %s\n' "$previous_dir" >&2
    pm2 delete portfolio >/dev/null 2>&1
    if pm2 start "$rollback_config" --only portfolio && wait_http 3001 &&
       node "$PM2_HELPER" verify unused "$previous_dir" && pm2 save; then
      printf 'ROLLBACK PASSED\n' >&2
    else
      printf 'ROLLBACK NEEDS ATTENTION: %s\n' "$rollback_config" >&2
      pm2 logs portfolio --lines 40 --nostream
    fi
  else
    printf 'Preparation failed; the running portfolio was not changed.\n' >&2
  fi
  exit "$status"
}
trap stop_preview EXIT
trap 'on_failure $?' ERR
trap 'on_failure 129' HUP
trap 'on_failure 130' INT
trap 'on_failure 143' TERM

release_dir=$(mktemp -d "$RELEASES/${SHA:0:12}.XXXXXX")
git worktree add --detach "$release_dir" "$SHA"
cp "$ENV_FILE" "$release_dir/.env.production.local"
chmod 600 "$release_dir/.env.production.local"
cd "$release_dir"

npm ci --include=dev
npm run lint
npm run test:consent
npm run test:analytics
npm audit --omit=dev
NODE_ENV=production NEXT_BUILD_DIR=.next npm run build
test -s .next/BUILD_ID
grep -Fq "$GAID" .next/server/app/index.html

if ss -H -ltn '( sport = :3201 )' | grep -q .; then
  fail 'Preview port 3201 is occupied.'
fi
NODE_ENV=production NEXT_BUILD_DIR=.next \
  node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3201 \
  > "$attempt_dir/preview.log" 2>&1 &
preview_pid=$!
if ! wait_http 3201; then
  tail -n 40 "$attempt_dir/preview.log"
  on_failure 1
fi
node scripts/check-seo.mjs http://127.0.0.1:3201
node scripts/check-privacy.mjs http://127.0.0.1:3201
node scripts/check-deployment.mjs http://127.0.0.1:3201
stop_preview

# Refuse a stale run or a manual process change before touching the live app.
cd "$CHECKOUT"
check_head
node "$PM2_HELPER" unchanged "$rollback_config"
node "$PM2_HELPER" release "$release_config" "$release_dir" "$GAID"
cd "$release_dir"

switching=1
pm2 delete portfolio
pm2 start "$release_config" --only portfolio
wait_http 3001
node "$PM2_HELPER" verify unused "$release_dir"
node scripts/check-seo.mjs http://127.0.0.1:3001
node scripts/check-privacy.mjs http://127.0.0.1:3001
node scripts/check-deployment.mjs http://127.0.0.1:3001
pm2 save
switching=0
printf '\nDEPLOY PASSED\nCOMMIT=%s\nRELEASE_DIR=%s\n' "$SHA" "$release_dir"
