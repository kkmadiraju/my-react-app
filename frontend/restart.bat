@echo off
setlocal
cd /d "%~dp0"

call :LoadEnv "..\.env"
call :LoadEnv
if not defined VITE_CALC_API_URL (
  set "VITE_CALC_API_URL=http://localhost:8080"
)

echo Restarting frontend...
call :KillPortOwner 5173
if %errorlevel% neq 0 (
  echo Failed to free frontend port 5173.
)

echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
  echo Frontend build failed.
  exit /b %errorlevel%
)

start "frontend" cmd /k "npm run preview -- --host 0.0.0.0 --port 5173"
exit /b

:KillPortOwner
set "PORT=%~1"
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort %PORT% -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"
exit /b

:LoadEnv
set "ENV_FILE=%~1"
if "%ENV_FILE%"=="" (
  set "ENV_FILE=.env"
)
if not exist "%ENV_FILE%" (
  exit /b
)
for /f "usebackq eol=# delims=" %%L in ("%ENV_FILE%") do set "%%L"
exit /b
