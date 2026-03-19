param(
    [switch]$Headed,
    [switch]$InstallBrowser
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

if ($InstallBrowser) {
    Write-Host 'Installing Playwright Chromium browser...'
    & npx playwright install chromium
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

$npmArgs = @('run', 'test:e2e')
if ($Headed) {
    $npmArgs += '--'
    $npmArgs += '--headed'
}

Write-Host "Running frontend automation from $repoRoot"
& npm $npmArgs
exit $LASTEXITCODE
