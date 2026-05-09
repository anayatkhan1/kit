#!/usr/bin/env bash
# Verify production (or any) hosted registry lists web-agent and serves web-agent.json.
# Usage: ./scripts/verify-agentcn-registry-live.sh [baseUrl]
# Default baseUrl: https://agentcn.dev/r
set -euo pipefail

BASE="${1:-https://agentcn.dev/r}"
BASE="${BASE%/}"

echo "GET $BASE/index.json"
INDEX="$(curl -fsSL "$BASE/index.json")"
if ! printf '%s\n' "$INDEX" | grep -q '"name"[[:space:]]*:[[:space:]]*"web-agent"'; then
  echo "FAIL: index.json must include an item named web-agent." >&2
  echo "Hint: run pnpm agentcn:registry:build && pnpm deploy:build, then redeploy the web app." >&2
  exit 1
fi
echo "OK: index lists web-agent."

echo "GET $BASE/web-agent.json"
curl -fsSL -o /dev/null "$BASE/web-agent.json"
echo "OK: web-agent.json is reachable."
