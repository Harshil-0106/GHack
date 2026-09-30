@echo off
echo ==============================================
echo      Stopping Rehab WebApp (Next.js Stack)    
echo ==============================================

echo Killing Next.js Frontend Server...
taskkill /FI "WINDOWTITLE eq RehabFrontend*" /T /F >nul 2>&1

echo Killing MediaPipe Backend...
taskkill /FI "WINDOWTITLE eq RehabBackend*" /T /F >nul 2>&1

:: Also explicitly kill Node if it orphans
taskkill /F /IM node.exe >nul 2>&1

echo.
echo All background servers have been terminated and your webcam is released!
echo ==============================================
