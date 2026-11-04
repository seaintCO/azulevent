# Ocean Azul V6 — extract latest ZIP from Downloads, update seaintCO/azulevent main, test, push, start local preview.
# This script does NOT force-push, delete files, or overwrite uncommitted changes.
$ErrorActionPreference = 'Stop'
$repoUrl = 'https://github.com/seaintCO/azulevent.git'
$desktop = [Environment]::GetFolderPath('Desktop')
$repoDir = Join-Path $desktop 'azulevent'
$zipName = 'Ocean-Azul-Newsroom-V6-Yahoo-First-Compact-Event.zip'
$zipPath = Join-Path (Join-Path $HOME 'Downloads') $zipName
$tempDir = Join-Path $env:TEMP 'OceanAzulV6Extract'

if (-not (Test-Path -LiteralPath $zipPath)) {
  throw "Please download $zipName from ChatGPT and save it to Downloads first. Not found: $zipPath"
}
foreach ($toolName in @('git', 'node', 'npm')) {
  if (-not (Get-Command $toolName -ErrorAction SilentlyContinue)) {
    throw "Missing required program: $toolName. Install Git for Windows and Node.js LTS first."
  }
}
Write-Host 'OCEAN AZUL V6: Updating the website and GitHub main...' -ForegroundColor Cyan

if (Test-Path -LiteralPath (Join-Path $repoDir '.git')) {
  Set-Location $repoDir
  $origin = git remote get-url origin
  if ($LASTEXITCODE -ne 0 -or $origin -notmatch 'seaintCO/azulevent(\.git)?$') {
    throw 'This local checkout does not point to seaintCO/azulevent. Aborting to avoid pushing to the wrong repository.'
  }
  $dirty = git status --porcelain
  if ($LASTEXITCODE -ne 0 -or $dirty) { throw 'Uncommitted local changes exist. Commit or stash them first; this script will not overwrite them.' }
  git switch main
  if ($LASTEXITCODE -ne 0) { throw 'Could not switch to main.' }
  git pull --ff-only origin main
  if ($LASTEXITCODE -ne 0) { throw 'Git pull failed. Resolve branch divergence before continuing.' }
} else {
  if (Test-Path -LiteralPath $repoDir) { throw "Folder already exists but is not a Git checkout: $repoDir" }
  git clone $repoUrl $repoDir
  if ($LASTEXITCODE -ne 0) { throw 'Git clone failed.' }
  Set-Location $repoDir
  git switch main
  if ($LASTEXITCODE -ne 0) { throw 'Could not switch to main.' }
}

if (Test-Path -LiteralPath $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
Expand-Archive -LiteralPath $zipPath -DestinationPath $tempDir -Force
$source = $tempDir
$rootItems = @(Get-ChildItem -LiteralPath $tempDir -Force)
if ($rootItems.Count -eq 1 -and $rootItems[0].PSIsContainer) { $source = $rootItems[0].FullName }
if (-not (Test-Path -LiteralPath (Join-Path $source 'package.json'))) {
  throw 'The ZIP does not have the expected Ocean Azul package.json at the root.'
}
Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
  if ($_.Name -ne '.git' -and $_.Name -ne 'node_modules') {
    Copy-Item -LiteralPath $_.FullName -Destination $repoDir -Recurse -Force
  }
}
Set-Location $repoDir
npm run check
if ($LASTEXITCODE -ne 0) { throw 'Site validation failed. No changes were pushed.' }

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
  git commit -m 'Ocean Azul V6: Yahoo-first market desk, compact AZUL event and Oct 30 edition'
  if ($LASTEXITCODE -ne 0) { throw 'Git commit failed.' }
  git push origin main
  if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Check GitHub authentication.' }
  Write-Host 'SUCCESS: Website V6 pushed to GitHub main.' -ForegroundColor Green
} elseif ($LASTEXITCODE -eq 0) {
  Write-Host 'No new changes to push.' -ForegroundColor Yellow
} else { throw 'Could not inspect Git changes.' }

if (Get-Command code -ErrorAction SilentlyContinue) { code $repoDir }
Write-Host 'Preview the newsroom at http://localhost:3000 (Ctrl+C to stop).' -ForegroundColor Cyan
npm run dev
