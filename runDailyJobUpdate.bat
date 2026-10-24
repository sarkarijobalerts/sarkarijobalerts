@echo off
setlocal enabledelayedexpansion

set "ROOT_DIR=c:\Users\rohit\OneDrive\Documents\Sarkari News"
set "LOG_DIR=%ROOT_DIR%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "LOG_FILE=%LOG_DIR%\daily_update_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo 🚀 SARKARI JOB ALERTS DAILY UPDATE: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

echo [1/3] Scraping fresh jobs, AI processing, and Indexing... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%\backend"
call node scripts/manualFullUpdate.js >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Scraping failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo [2/3] Building static Next.js export and sitemap.xml... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%\frontend"
call npm run build >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo [3/3] Deploying to Hostinger and purging cache... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%\backend"
call node scripts/deployHostingerViaMcp.js >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Hostinger deployment failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo ✅ DAILY UPDATE COMPLETED SUCCESSFULLY: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

exit /b 0
