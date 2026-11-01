#!/usr/bin/env bash
# Only this forced command is available to the GitHub Actions SSH key.
set -Eeuo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

if [[ ! "${SSH_ORIGINAL_COMMAND:-}" =~ ^deploy\ ([a-f0-9]{40})$ ]]; then
  printf 'Only deploy <full-commit-sha> is allowed.\n' >&2
  exit 1
fi
sha="${BASH_REMATCH[1]}"
unit="portfolio-deploy-${sha:0:12}-$(date +%s)-$$"

# An SSH disconnect must not kill a deployment halfway through its PM2 switch.
# Logs go to the journal, not a pipe owned by the SSH client.
status=0
systemd-run --quiet --wait --collect --unit="$unit" \
  --property=User=root --property=Type=oneshot --property=TimeoutStartSec=25min \
  --property=TimeoutStopSec=120s --property=KillMode=mixed \
  --property=StandardOutput=journal --property=StandardError=journal \
  /usr/local/sbin/portfolio-deploy "$sha" || status=$?
journalctl --unit="$unit" --no-pager --output=cat || true
exit "$status"
