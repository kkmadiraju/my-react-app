@echo off
setlocal
cd /d "%~dp0"

call :LoadEnv "..\.env"
call :LoadEnv
if not defined SQLSERVER_USE_WINDOWS_AUTH (
  set "SQLSERVER_USE_WINDOWS_AUTH=false"
)
if not defined SQLSERVER_URL (
  set "SQLSERVER_URL=jdbc:sqlserver://DESKTOP-VKNSMP5:1433;databaseName=calculator_db;trustServerCertificate=true;encrypt=true"
)

if /I "%SQLSERVER_USE_WINDOWS_AUTH%"=="true" (
  set "SQLSERVER_USERNAME="
  set "SQLSERVER_PASSWORD="
) else (
  if not defined SQLSERVER_USERNAME (
    set "SQLSERVER_USERNAME=sa"
  )
  if not defined SQLSERVER_PASSWORD (
    call :PromptPassword
  )

  if "%SQLSERVER_PASSWORD%"=="" (
    echo ERROR: SQLSERVER_PASSWORD is not set.
    echo Set it before starting the backend, for example:
    echo   set SQLSERVER_PASSWORD=your_password
    echo Or define it in .env file.
    exit /b 1
  )
  if /I "%SQLSERVER_PASSWORD%"=="your_sqlserver_password" (
    echo ERROR: SQLSERVER_PASSWORD is still set to the placeholder value.
    echo Edit .env and replace SQLSERVER_PASSWORD with your real SQL Server password.
    exit /b 1
  )
)

echo Restarting backend...
call :KillPortOwner 8080

echo Building backend...
call gradlew.bat clean bootJar
if %errorlevel% neq 0 (
  echo Backend build failed.
  exit /b %errorlevel%
)

for %%J in (build\libs\*.jar) do set "APP_JAR=%%~fJ"
if not defined APP_JAR (
  echo Backend jar not found in build\libs.
  exit /b 1
)

start "backend" cmd /k "java -jar \"%APP_JAR%\""
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

:PromptPassword
set /p "SQLSERVER_PASSWORD=Enter SQLSERVER_PASSWORD: "
if "%SQLSERVER_PASSWORD%"=="" (
  echo Password cannot be empty.
  goto PromptPassword
)
exit /b
