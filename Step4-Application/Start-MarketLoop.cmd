@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is missing. Install Node.js 24 or newer, then run this file again.
  pause
  exit /b 1
)
node "%~dp0launch.mjs"
echo.
pause
