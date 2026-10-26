#!/usr/bin/env bash
# Activa un release ya compilado (.next/standalone) sin ejecutar npm run build.
# Uso: bash deploy/activate-release.sh /tmp/release.tar.gz [APP_DIR]
set -euo pipefail

TARBALL="${1:-/tmp/release.tar.gz}"
APP_DIR="${2:-}"

if [ -z "$APP_DIR" ]; then
  APP_DIR="$HOME/proyects/shop"
  if [ ! -d "$APP_DIR/.git" ] && [ -d "$HOME/shop/.git" ]; then APP_DIR="$HOME/shop"; fi
fi

if [ ! -f "$TARBALL" ]; then
  echo "ERROR: no existe el artefacto $TARBALL"
  exit 1
fi

cd "$APP_DIR"
echo "==> APP_DIR=$APP_DIR"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$HOME/.local/share/fnm:$HOME/.fnm:$HOME/.volta/bin:/usr/local/bin:/usr/bin:$PATH"

if ! command -v pm2 >/dev/null 2>&1; then
  npm i -g pm2
fi

echo "==> Extrayendo release en .next/standalone"
rm -rf .next/standalone.new .next/standalone.old
mkdir -p .next/standalone.new
tar -xzf "$TARBALL" -C .next/standalone.new

if [ ! -f .next/standalone.new/server.js ]; then
  echo "ERROR: el artefacto no contiene server.js (revisa output: standalone)"
  exit 1
fi

if [ -d .next/standalone ]; then
  mv .next/standalone .next/standalone.old
fi
if ! mv .next/standalone.new .next/standalone; then
  echo "ERROR: no se pudo activar el release, restaurando el anterior"
  rm -rf .next/standalone
  [ -d .next/standalone.old ] && mv .next/standalone.old .next/standalone
  exit 1
fi

echo "==> Reiniciando PM2 (shop)"
pm2 delete shop >/dev/null 2>&1 || true
pm2 start ecosystem.config.js --only shop
pm2 save

echo "==> Health check en http://127.0.0.1:3001"
ok=0
for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:3001/" >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 1
done

if [ "$ok" -ne 1 ]; then
  echo "ERROR: health check fallo. Restaurando release anterior..."
  pm2 delete shop >/dev/null 2>&1 || true
  rm -rf .next/standalone
  if [ -d .next/standalone.old ]; then mv .next/standalone.old .next/standalone; fi
  pm2 start ecosystem.config.js --only shop
  pm2 save
  exit 1
fi

pm2 ls
echo "==> Deploy OK - $(date) - $(git rev-parse --short HEAD 2>/dev/null || echo 'sin git')"
