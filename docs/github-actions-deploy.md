# Deploy the portfolio with GitHub Actions

The `Portfolio checks and deployment` workflow checks pushes/PRs to
`rebranding-2026`. Production deployment runs **only** from the manual
`workflow_dispatch` event, with `rebranding-2026` selected. A normal push never
changes the VM. Automatic deployment on push is deliberately not enabled yet.

## What runs

1. GitHub-hosted Ubuntu 24.04: install the lockfile, lint, consent and analytics
   tests, deployment failure/rollback tests, ShellCheck and production audit.
2. A restricted SSH command sends the exact checked commit SHA to Contabo.
3. A systemd oneshot service runs the installed deployment script. An SSH
   disconnect or canceled Actions run does not terminate an in-progress cutover.
4. The server locks deployments, fetches `rebranding-2026` and requires the
   requested SHA to be its current head. It creates a new private worktree for
   every attempt, copies the production environment and builds there.
5. The release is previewed on `127.0.0.1:3201`. SEO, privacy, GA4 configuration,
   manifest and exact icon checks must pass before the running app is touched.
6. The script rechecks the branch and current PM2 process, saves a private
   rollback configuration, and replaces only `portfolio` on port 3001. The
   production process starts Next directly with the current Node executable;
   this avoids running a repository-supplied ecosystem file with other apps.
7. Origin checks and `pm2 save` must pass. Otherwise the previous per-app launch
   configuration is restored and saved. There is a brief interruption during
   process replacement; this is not a zero-downtime deployment.
8. Actions checks public HTTPS through Cloudflare. Failure here makes the run
   red, but does not automatically roll back a healthy origin due to an edge
   cache/network problem. Read the step logs before taking further action.

Actions deployment concurrency uses `cancel-in-progress: false`; a server-side
`flock` also prevents overlapping manual/Actions deployments. GitHub concurrency
does not guarantee FIFO ordering, so stale SHAs are rejected again before
cutover. A workflow must be rerun against the latest branch revision after a
stale-run rejection.

## One-time: make Run workflow available

GitHub requires a `workflow_dispatch` workflow to exist on the repository's
default branch. The default branch is `master`, while this portfolio is released
from `rebranding-2026`.

Merge the separate bootstrap PR containing **only**
`.github/workflows/deploy-portfolio.yml` into `master`. This does not merge the
portfolio redesign or deploy anything. Then use Actions → Portfolio checks and
deployment → Run workflow → **Branch: rebranding-2026**. Selecting `master`
intentionally fails the branch guard before checkout or SSH.

Do not change the default branch or merge the full redesign just to enable a
manual button. The bootstrap workflow is the same file as on the release branch.

## One-time: dedicated SSH key

Generate an unencrypted Ed25519 key dedicated to this workflow, with a unique
filename so it cannot replace a personal key. For example, in PowerShell:

```powershell
$portfolioKey = Join-Path $env:USERPROFILE '.ssh\portfolio-actions'
if (Test-Path -LiteralPath $portfolioKey) { throw 'Choose a new filename; this key already exists.' }
ssh-keygen -t ed25519 -C portfolio-actions -f $portfolioKey
# Leave both passphrase prompts empty; Actions cannot answer interactive prompts.
Get-Content -LiteralPath "$portfolioKey.pub"
```

Only the `.pub` line goes to the VM. The private key goes directly to the
production environment secret described below, never into Git or chat.

## One-time: install the reviewed server scripts

Use the existing trusted SSH session to the VM as root. Fetch the reviewed
revision of `rebranding-2026` and create a separate setup worktree; do not
switch or build inside the currently running release:

```bash
(
  set -Eeuo pipefail
  umask 077
  cd /root/projects/personal-blog-nextjs
  git fetch origin rebranding-2026
  setup_commit=$(git rev-parse origin/rebranding-2026)
  setup_dir=$(mktemp -d /root/projects/portfolio-releases/actions-setup.XXXXXX)
  git worktree add --detach "$setup_dir" "$setup_commit"
  read -r -p 'Paste the public ssh-ed25519 deployment key: ' deploy_public_key
  bash "$setup_dir/scripts/deploy/install.sh" "$deploy_public_key"
)
```

The installer does not restart the site. It installs root-owned files:

- `/usr/local/sbin/portfolio-deploy` — build, preview, switch, rollback.
- `/usr/local/sbin/portfolio-deploy-ssh` — accepts only `deploy <40-hex-sha>`.
- `/usr/local/lib/portfolio-deploy/pm2-state.cjs` — per-app PM2 state/config.
- `/etc/portfolio-deploy/production.env` — initial private copy of the running
  app's `.env.production.local`. Edit this file when production variables change.

The public key is appended to root's existing `authorized_keys` with
`restrict,command="/usr/local/sbin/portfolio-deploy-ssh"`. Other keys remain
unchanged. The key cannot request a shell, PTY, agent/port/X11 forwarding or file
transfer. The forced command is fixed outside the checkout and never auto-updates.
Reinstall the reviewed scripts manually when those scripts change.

This retains the VM's existing root-owned PM2 namespace (`/root/.pm2`). A normal
new Linux user would start a different PM2 daemon. The forced command is not a
sandbox for the app: repository-controlled Node/npm code still runs as root,
as it does in the current deployment. Restrict who can push release code and
use the production environment's branch rules. Migrating the app to a separate
service user is a separate change, not silently done by this installer.

No process cleanup, old-release deletion, dependency force-fix, global Node
upgrade or Cloudflare setting changes are performed.

## One-time: GitHub production environment

In Settings → Environments, create **production** and restrict deployment
branches to the exact branch **rebranding-2026** (no tags). Required reviewers
can optionally be added; the workflow already requires a manual run.

Add these environment secrets:

| Secret | Value |
| --- | --- |
| `PORTFOLIO_SSH_HOST` | The VM SSH hostname or IPv4 address |
| `PORTFOLIO_SSH_KEY` | Entire dedicated private key, including BEGIN/END lines |
| `PORTFOLIO_SSH_KNOWN_HOSTS` | Verified SSH host public key line from the VM |

For the existing port 22, leave `PORTFOLIO_SSH_PORT` unset. If SSH uses another
port, add it as a production environment **variable**.

Construct known_hosts from the host key obtained over the existing trusted VM
session, not an unverified `ssh-keyscan` executed inside CI. For port 22:

```text
YOUR_SSH_HOST ssh-ed25519 AAAA...host-public-key...
```

For another port use `[YOUR_SSH_HOST]:PORT` as the first field. The installer
prints only the host's public key. It never prints a private key or application
environment. Host key verification is always enabled by the workflow.

Application environment variables and database credentials stay on the VM. The
GA4 ID `G-E4G1QVX7T9` is public and intentionally explicit in the workflow and
server script to avoid deploying a test ID.

## First run and troubleshooting

Wait for the push's validation job to pass. After the bootstrap PR, SSH key and
production environment are configured, run the workflow from `rebranding-2026`.
Inspect validation, server deployment and public checks separately.

An SSH failure may mean no job started, or that SSH disconnected after systemd
started one. Do not assume a red/canceled run rolled back. On the VM inspect:

```bash
systemctl list-units 'portfolio-deploy-*' --all
journalctl --unit='portfolio-deploy-*' --since '30 minutes ago' --no-pager
pm2 describe portfolio
```

The server reports `COMMIT`, `RELEASE_DIR` and the private rollback config path
in its log. A failed origin cutover reports `ROLLBACK PASSED` or
`ROLLBACK NEEDS ATTENTION`; inspect the latter immediately. A lock rejection
means another job is still running. Do not delete the lock or restart unrelated
PM2 apps to bypass it.

The systemd deployment timeout is 25 minutes, followed by up to 120 seconds for
termination/rollback. SIGKILL, power loss or VM failure cannot run a shell trap;
the saved rollback file and old releases remain available for recovery.

The old manual `ecosystem.config.js` procedure remains available. Automatic
releases use unique directories and their own minimal per-app configuration;
never rebuild a directory that PM2 or a rollback configuration references.

References:

- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow
- https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments
- https://pm2.keymetrics.io/docs/usage/application-declaration/
