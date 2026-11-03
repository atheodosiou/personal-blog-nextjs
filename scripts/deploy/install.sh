#!/usr/bin/env bash
# Run manually from a reviewed release on the VM. This is never called by CI.
set -Eeuo pipefail
umask 077
# Capture the caller's working runtime before setting a noninteractive PATH.
# /usr/local/node-v22 can be older than the Node selected by the login shell.
runtime_node=$(type -P node)
runtime_node=$("$runtime_node" -p 'process.execPath')
runtime_bin=$(dirname -- "$runtime_node")
export PATH="$runtime_bin:/usr/local/node-v22/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export PM2_HOME=/root/.pm2
[[ $(id -u) == 0 ]] || { printf 'Run as root on the VM.\n' >&2; exit 1; }
[[ $# == 1 && "$1" =~ ^ssh-ed25519\ ([A-Za-z0-9+/]+={0,2})(\ .*)?$ ]] || {
  printf 'Pass one public ssh-ed25519 key as the argument.\n' >&2; exit 1;
}
key_data="${BASH_REMATCH[1]}"
"$runtime_node" -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 12)) {
    console.error("Select Node.js >=22.12.0 in this shell before installing deployment scripts.");
    process.exit(1);
  }
  console.log("Pinning deployment Node:", process.version, process.execPath);
'
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
for tool in node pm2 systemd-run journalctl flock ssh-keygen; do
  command -v "$tool" >/dev/null
done
exec 9>/run/lock/portfolio-deploy.lock
flock -n 9 || { printf 'A deployment is running; install again later.\n' >&2; exit 1; }

temp_key=$(mktemp)
trap 'rm -f -- "$temp_key"' EXIT
printf 'ssh-ed25519 %s\n' "$key_data" > "$temp_key"
ssh-keygen -lf "$temp_key"

live_dir=$(pm2 jlist | node -e '
  let s = "";
  process.stdin.on("data", c => s += c);
  process.stdin.on("end", () => {
    const a = JSON.parse(s).find(a => a.name === "portfolio");
    if (!a || a.pm2_env.status !== "online") process.exit(1);
    process.stdout.write(a.pm2_env.pm_cwd);
  });
')
case "$live_dir" in
  /root/projects/portfolio-releases/*|/root/projects/personal-blog-nextjs) ;;
  *) printf 'Unexpected running portfolio directory.\n' >&2; exit 1 ;;
esac
test -f "$live_dir/.env.production.local"

install -d -m 700 /etc/portfolio-deploy
install -d -m 755 /usr/local/lib/portfolio-deploy
if [[ ! -e /etc/portfolio-deploy/production.env ]]; then
  install -m 600 "$live_dir/.env.production.local" /etc/portfolio-deploy/production.env
fi
chmod 600 /etc/portfolio-deploy/production.env
printf '%s\n' "$runtime_node" > /etc/portfolio-deploy/node-path.tmp
chmod 600 /etc/portfolio-deploy/node-path.tmp
mv -f /etc/portfolio-deploy/node-path.tmp /etc/portfolio-deploy/node-path
install -m 644 "$script_dir/pm2-state.cjs" /usr/local/lib/portfolio-deploy/pm2-state.cjs
install -m 755 "$script_dir/portfolio-deploy.sh" /usr/local/sbin/portfolio-deploy
install -m 755 "$script_dir/portfolio-deploy-ssh.sh" /usr/local/sbin/portfolio-deploy-ssh

install -d -m 700 /root/.ssh
touch /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
key_line="restrict,command=\"/usr/local/sbin/portfolio-deploy-ssh\" ssh-ed25519 $key_data portfolio-actions"
if ! grep -Fqx "$key_line" /root/.ssh/authorized_keys; then
  if grep -Fq "$key_data" /root/.ssh/authorized_keys; then
    printf 'This key is already authorized with other options; review it manually.\n' >&2
    exit 1
  fi
  printf '\n%s\n' "$key_line" >> /root/.ssh/authorized_keys
fi
printf '\nInstalled portfolio deployment command and restricted public key.\n'
printf 'For PORTFOLIO_SSH_KNOWN_HOSTS, prefix the following public key with your SSH host:\n'
cut -d ' ' -f 1-2 /etc/ssh/ssh_host_ed25519_key.pub
