param([string]$Target = 'C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop')
$ErrorActionPreference = 'Stop'
$expected = [IO.Path]::GetFullPath('C:\Users\DAMON\Downloads\Whatsapp CRM client\MarketLoop').TrimEnd('\')
$resolved = [IO.Path]::GetFullPath($Target).TrimEnd('\')
if ($resolved -ne $expected) { throw "This installer is restricted to: $expected" }
if (!(Test-Path -LiteralPath (Join-Path $resolved 'package.json'))) { throw 'Existing MarketLoop project was not found at the expected path.' }
$package = Get-Content -Raw -LiteralPath (Join-Path $resolved 'package.json') | ConvertFrom-Json
if ($package.name -ne 'marketloop') { throw 'The destination is not a MarketLoop project.' }
$payload = Join-Path $PSScriptRoot 'Step4-Application.zip'
if (!(Test-Path -LiteralPath $payload)) { throw 'Keep this installer beside Step4-Application.zip.' }
Write-Host 'Stop the MarketLoop server with Ctrl+C before continuing.'
$answer = Read-Host 'Has the server stopped? Type YES to install'
if ($answer -ne 'YES') { Write-Host 'No files changed.'; exit }
$stage = Join-Path ([IO.Path]::GetTempPath()) ('MarketLoop-Step4-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
Expand-Archive -LiteralPath $payload -DestinationPath $stage
$files = @('launch.mjs','Start-MarketLoop.cmd','server.mjs','database.mjs','campaigns.mjs','campaign-adapter.mjs','catalogue.mjs','package.json','test.mjs','ui.test.mjs','migration.test.mjs','campaigns.test.mjs','README.md','.env.example','STEP4.md','dist\index.html','dist\client.html','dist\client.js','dist\client.css','dist\data-center.js','dist\campaign-step4.js')
foreach ($file in $files) { if (!(Test-Path -LiteralPath (Join-Path $stage $file))) { throw "Missing update file: $file" } }
$backup = Join-Path $resolved ('application-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0,6))
New-Item -ItemType Directory -Path $backup | Out-Null
foreach ($file in $files) {
    $old = Join-Path $resolved $file
    if (Test-Path -LiteralPath $old) {
        $destination = Join-Path $backup $file
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
        Copy-Item -LiteralPath $old -Destination $destination
    }
}
foreach ($file in $files) {
    $destination = Join-Path $resolved $file
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Copy-Item -LiteralPath (Join-Path $stage $file) -Destination $destination -Force
}
# Deliberately do not copy, replace, delete or edit .env, data/, sessions, or node_modules/.
Write-Host "Step 4 files installed in $resolved"
Write-Host "Previous application files are backed up in $backup"
Write-Host '.env, database, PDFs and WhatsApp sessions were preserved.'
Write-Host 'Next: open this project folder, run npm.cmd install, then npm.cmd start.'
Write-Host 'Daily sending stays off until CAMPAIGN_WORKER_ENABLED=true is set in your .env.'
