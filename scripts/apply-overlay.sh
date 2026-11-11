#!/usr/bin/env bash
# Apply the web-port overlay onto the cloned upstream checkout in ./upstream.
#
# Overlay = 16 browser shims + two anchored config patches + the local CORS proxy.
# No business code is touched; native android/ios resolution is unaffected.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM="$ROOT/upstream"

if [ ! -d "$UPSTREAM/.git" ]; then
  echo "::error::upstream/ is not a git checkout; run the clone step first." >&2
  exit 1
fi

# 1. Web shims.
mkdir -p "$UPSTREAM/src/web-shims"
cp "$ROOT/overlay/src/web-shims/"*.js "$UPSTREAM/src/web-shims/"

# 2. Anchored config patches (idempotent).
node "$ROOT/scripts/patch-app-json.js" "$UPSTREAM/app.json"
node "$ROOT/scripts/patch-metro.js" "$UPSTREAM/metro.config.js"

# 3. Local CORS proxy (dev helper, not part of the web bundle).
rm -rf "$UPSTREAM/web-proxy"
cp -r "$ROOT/overlay/web-proxy" "$UPSTREAM/web-proxy"

# 4. Adaptation notes for whoever reads the build later.
cp "$ROOT/overlay/WEB-ADAPTATION.md" "$UPSTREAM/WEB-ADAPTATION.md"

echo "Overlay applied to $UPSTREAM"
