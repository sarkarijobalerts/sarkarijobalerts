@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=c:\Users\rohit\OneDrive\Documents\Sarkari News"
set "LOG_DIR=%ROOT_DIR%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "LOG_FILE=%LOG_DIR%\festival_broadcast_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo 🪔 SARKARI JOB ALERTS FESTIVAL DISPATCH: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

cd /d "%ROOT_DIR%\backend"
call node scripts/publishFestivalPost.js today >> "%LOG_FILE%" 2>&1

echo Completed with status %errorlevel% >> "%LOG_FILE%" 2>&1
exit /b %errorlevel%
