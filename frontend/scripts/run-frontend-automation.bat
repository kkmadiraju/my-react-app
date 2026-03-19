@echo off
setlocal
cd /d "%~dp0\.."

powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\run-frontend-automation.ps1" %*
exit /b %errorlevel%
