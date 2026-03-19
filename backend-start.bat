@echo off
setlocal
cd /d "%~dp0"

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
    echo Set it before starting my-react-service, for example:
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

echo Stopping any process on port 8080...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo Building my-react-service...
call my-react-service\gradlew.bat -p my-react-service clean bootJar
if %errorlevel% neq 0 (
  echo my-react-service build failed.
  exit /b %errorlevel%
)

for %%J in (my-react-service\build\libs\*.jar) do set "APP_JAR=%%~fJ"
if not defined APP_JAR (
  echo my-react-service jar not found in my-react-service\build\libs.
  exit /b 1
)

start "my-react-service" cmd /k "java -jar \"%APP_JAR%\""
exit /b

:LoadEnv
if not exist ".env" (
  exit /b
)
for /f "usebackq eol=# delims=" %%L in (".env") do set "%%L"
exit /b

:PromptPassword
set /p "SQLSERVER_PASSWORD=Enter SQLSERVER_PASSWORD: "
if "%SQLSERVER_PASSWORD%"=="" (
  echo Password cannot be empty.
  goto PromptPassword
)
exit /b
