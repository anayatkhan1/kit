#!/usr/bin/env bash
# Multi-runner smoke: list + add web-agent --dry-run --yes for npm/pnpm/yarn/bun.
# Uses a local tarball (from `pnpm --filter agentcn pack:smoke`) and a registry path/URL.
#
# Usage (from kit/):
#   pnpm --filter agentcn pack:smoke
#   ./scripts/agentcn-runner-matrix-smoke.sh
#
# Env:
#   AGENTCN_TARBALL   — path to agentcn-*.tgz (default: packages/agentcn/cli/.artifacts/latest tgz)
#   AGENTCN_REGISTRY  — -r value: directory or base URL (default: apps/web/public/r)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ART_DIR="$ROOT/packages/agentcn/cli/.artifacts"
TGZ="${AGENTCN_TARBALL:-}"
if [[ -z "$TGZ" || ! -f "$TGZ" ]]; then
  TGZ="$(ls -1t "$ART_DIR"/agentcn-*.tgz 2>/dev/null | head -1 || true)"
fi
if [[ -z "$TGZ" || ! -f "$TGZ" ]]; then
  echo "No tarball found. Run: pnpm --filter agentcn pack:smoke" >&2
  exit 1
fi

REG="${AGENTCN_REGISTRY:-$ROOT/apps/web/public/r}"
SMOKE="$ROOT/tmp/agentcn-runner-smoke-$(date +%s)"
mkdir -p "$SMOKE"

run_npm() {
  local d="$SMOKE/npm"
  mkdir -p "$d"
  (cd "$d" && npm init -y >/dev/null 2>&1 && npm install "$TGZ" --silent)
  (cd "$d" && npx agentcn list -r "$REG")
  (cd "$d" && npx agentcn add web-agent --dry-run --yes -r "$REG")
}

run_pnpm() {
  local d="$SMOKE/pnpm"
  mkdir -p "$d"
  printf '{"name":"agentcn-smoke-pnpm","private":true}\n' >"$d/package.json"
  (cd "$d" && pnpm add "$TGZ" >/dev/null)
  (cd "$d" && pnpm exec agentcn list -r "$REG")
  (cd "$d" && pnpm exec agentcn add web-agent --dry-run --yes -r "$REG")
}

run_yarn() {
  if ! command -v corepack >/dev/null 2>&1; then
    echo "SKIP yarn: install Node with corepack or run: corepack enable"
    return 0
  fi
  local d="$SMOKE/yarn"
  mkdir -p "$d"
  printf '{"name":"agentcn-smoke-yarn","private":true}\n' >"$d/package.json"
  (
    cd "$d"
    corepack enable yarn 2>/dev/null || true
    yarn set version stable >/dev/null 2>&1
    yarn add "file:$TGZ" >/dev/null
  )
  (cd "$d" && yarn exec agentcn list -r "$REG")
  (cd "$d" && yarn exec agentcn add web-agent --dry-run --yes -r "$REG")
}

run_bun() {
  if ! command -v bun >/dev/null 2>&1; then
    echo "SKIP bun: https://bun.sh"
    return 0
  fi
  local d="$SMOKE/bun"
  mkdir -p "$d"
  printf '{"name":"agentcn-smoke-bun","private":true}\n' >"$d/package.json"
  (cd "$d" && bun add "$TGZ" >/dev/null)
  (cd "$d" && bunx agentcn list -r "$REG")
  (cd "$d" && bunx agentcn add web-agent --dry-run --yes -r "$REG")
}

echo "Tarball: $TGZ"
echo "Registry (-r): $REG"
echo ""

run_npm && echo "OK npm"
echo ""
run_pnpm && echo "OK pnpm"
echo ""
run_yarn && echo "OK yarn"
echo ""
run_bun && echo "OK bun"

echo ""
echo "Smoke dirs (delete when done): $SMOKE"
