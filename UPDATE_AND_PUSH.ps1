# Copy this script into VS Code PowerShell after downloading the ZIP from ChatGPT.
# Default: ZIP in Downloads; repo on Desktop; push to seaintCO/azulevent main; preview on localhost:3000.
$ErrorActionPreference = 'Stop'
$repository = 'https://github.com/seaintCO/azulevent.git'
$checkout = Join-Path $HOME 'Desktop\azulevent'
$zip = Join-Path $HOME 'Downloads\Ocean-Azul-Newsroom-V4-Private-Jet-3-Articles.zip'
$extract = Join-Path $env:TEMP 'Ocean-Azul-Newsroom-V4-Extract'

if (-not (Test-Path -LiteralPath $zip)) {
    throw "ZIP missing: $zip — download from ChatGPT and save in Downloads."
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Install Git for Windows first.' }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install Node.js 18+ first.' }

if (Test-Path -LiteralPath (Join-Path $checkout '.git')) {
    Set-Location $checkout
    if ((git status --porcelain)) { throw 'Repo has local changes. Commit/stash them before updating.' }
    git switch main
    if ($LASTEXITCODE -ne 0) { throw 'Could not switch to main.' }
    git pull --ff-only origin main
    if ($LASTEXITCODE -ne 0) { throw 'Git pull failed. Resolve branch divergence before continuing.' }
} else {
    if (Test-Path -LiteralPath $checkout) { throw "Folder already exists without .git: $checkout" }
    git clone $repository $checkout
    if ($LASTEXITCODE -ne 0) { throw 'Git clone failed.' }
    Set-Location $checkout
}
if (Test-Path -LiteralPath $extract) { Remove-Item -LiteralPath $extract -Recurse -Force }
Expand-Archive -LiteralPath $zip -DestinationPath $extract -Force
$source = $extract
$items = @(Get-ChildItem -LiteralPath $extract -Force)
if ($items.Count -eq 1 -and $items[0].PSIsContainer) { $source = $items[0].FullName }
Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
    if ($_.Name -ne '.git') { Copy-Item -LiteralPath $_.FullName -Destination $checkout -Recurse -Force }
}

npm run check
if ($LASTEXITCODE -ne 0) { throw 'Site validation failed.' }

# If oceanazulpartners.com is NOT your real production domain, run this BEFORE committing:
# npm run set-domain -- https://YOUR-REAL-DOMAIN.com

git add -A
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    git commit -m 'Ocean Azul V4: 3 founder profiles, aircraft photo, SEO schema and npm dev'
    if ($LASTEXITCODE -ne 0) { throw 'Git commit failed.' }
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Authentication or remote sync may be required.' }
    Write-Host 'SUCCESS: pushed Ocean Azul Newsroom V4 to GitHub main' -ForegroundColor Green
} elseif ($LASTEXITCODE -eq 0) {
    Write-Host 'No changes; GitHub checkout already matches this build.' -ForegroundColor Yellow
} else { throw 'git diff failed.' }

if (Get-Command code -ErrorAction SilentlyContinue) { code $checkout }
npm run dev
