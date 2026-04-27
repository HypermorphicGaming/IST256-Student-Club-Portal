#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

npm --prefix "$ROOT_DIR/backend" start &
BACKEND_PID=$!

npm --prefix "$ROOT_DIR/frontend" run dev &
FRONTEND_PID=$!

wait "$BACKEND_PID" "$FRONTEND_PID"
