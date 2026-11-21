@echo off
setlocal enabledelayedexpansion

set "NODE_ENV=production"
set "ROOT_DIR=c:\Users\rohit\OneDrive\Documents\Sarkari News"
set "LOG_DIR=%ROOT_DIR%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "LOG_FILE=%LOG_DIR%\daily_update_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo 🚀 SARKARI JOB ALERTS DAILY UPDATE: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

echo [0/2] Syncing latest updates from GitHub... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call git pull origin main >> "%LOG_FILE%" 2>&1

echo [1/2] Executing Full Lifecycle: Scrape, AI Format, Build, Hostinger Deploy, Pre-flight Verify, and Social Broadcast... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%\backend"
call node scripts/manualFullUpdate.js >> "%LOG_FILE%" 2>&1
if %errorlevel% neq 0 (
    echo ❌ Automated update failed with error code %errorlevel% >> "%LOG_FILE%" 2>&1
    exit /b %errorlevel%
)

echo [2/2] Syncing updated datasets & sitemap to GitHub repository... >> "%LOG_FILE%" 2>&1
cd /d "%ROOT_DIR%"
call git add frontend/lib/seedPosts.json frontend/public/sitemap.xml >> "%LOG_FILE%" 2>&1
call git commit -m "Auto-update job posts (local sync) [skip ci]" >> "%LOG_FILE%" 2>&1
call git push origin main >> "%LOG_FILE%" 2>&1

echo ============================================================ >> "%LOG_FILE%" 2>&1
echo ✅ DAILY UPDATE COMPLETED SUCCESSFULLY: %date% %time% >> "%LOG_FILE%" 2>&1
echo ============================================================ >> "%LOG_FILE%" 2>&1

exit /b 0
