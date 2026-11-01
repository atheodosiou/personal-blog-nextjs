#!/usr/bin/env bash
set -euo pipefail

# Build only. PM2 owns the production server lifecycle.
cd -- "$(dirname -- "$0")"
npm run build
