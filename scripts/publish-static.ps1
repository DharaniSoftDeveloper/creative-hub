Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$siteDir = Join-Path $repoRoot "artifacts\creative-hub"
$outputDir = Join-Path $siteDir "dist\public"
$publishDir = Join-Path $siteDir "publish"
$zipPath = Join-Path $publishDir "creative-hub-static.zip"

if (-not (Test-Path $siteDir)) {
  throw "Frontend directory not found: $siteDir"
}

Push-Location $siteDir
try {
  Write-Host "Building Creative Hub..." -ForegroundColor Cyan
  & pnpm build
  if ($LASTEXITCODE -ne 0) {
    throw "Build failed."
  }
} finally {
  Pop-Location
}

if (-not (Test-Path $outputDir)) {
  throw "Build output not found: $outputDir"
}

New-Item -ItemType Directory -Force -Path $publishDir | Out-Null
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Write-Host "Creating upload package..." -ForegroundColor Cyan
Compress-Archive -Path (Join-Path $outputDir "*") -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "Publish folder ready:" -ForegroundColor Green
Write-Host "  Static files: $outputDir"
Write-Host "  Upload zip  : $zipPath"
