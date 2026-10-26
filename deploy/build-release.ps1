# Compila en tu PC y deja deploy\release.tar.gz listo para subir por FileZilla/SCP.
# Uso: powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $env:NEXT_PUBLIC_API_URL) {
  $env:NEXT_PUBLIC_API_URL = "https://inventario.cocinamejor.store/api/v1/public"
}
if (-not $env:NEXT_PUBLIC_SHOP_URL) {
  $env:NEXT_PUBLIC_SHOP_URL = "https://cocinamejor.store"
}
$env:NEXT_TELEMETRY_DISABLED = "1"

Write-Host "==> npm ci"
npm ci --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "npm ci fallo" }

Write-Host "==> npm run build"
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build fallo" }

$release = Join-Path $PSScriptRoot "release"
$tarball = Join-Path $PSScriptRoot "release.tar.gz"
if (Test-Path -LiteralPath $release) { Remove-Item -LiteralPath $release -Recurse -Force }
if (Test-Path -LiteralPath $tarball) { Remove-Item -LiteralPath $tarball -Force }
New-Item -ItemType Directory -Path $release | Out-Null

Write-Host "==> Copiando standalone + static + public"
Get-ChildItem -LiteralPath ".next\standalone" -Force | Copy-Item -Destination $release -Recurse -Force
New-Item -ItemType Directory -Force -Path (Join-Path $release ".next") | Out-Null
Copy-Item -LiteralPath ".next\static" -Destination (Join-Path $release ".next\static") -Recurse -Force
Copy-Item -LiteralPath "public" -Destination (Join-Path $release "public") -Recurse -Force

if (-not (Test-Path -LiteralPath (Join-Path $release "server.js"))) {
  throw "No se genero server.js. Verifica output: 'standalone' en next.config.mjs"
}

Write-Host "==> Creando release.tar.gz"
tar -czf $tarball -C $release .
if ($LASTEXITCODE -ne 0) { throw "tar fallo" }

$size = [math]::Round((Get-Item -LiteralPath $tarball).Length / 1MB, 1)
Write-Host "Listo: $tarball ($size MB)"
Write-Host "Subelo a la EC2 y ejecuta: bash deploy/activate-release.sh /ruta/release.tar.gz"
