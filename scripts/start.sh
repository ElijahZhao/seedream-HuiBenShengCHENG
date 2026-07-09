#!/bin/bash
set -Eeuo pipefail

PORT="${PORT:-3000}"

echo "Starting HTTP service on port ${PORT} for deploy..."
npx next start --port ${PORT}
