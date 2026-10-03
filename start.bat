@echo off
echo ==============================================
echo      Starting Rehab WebApp (Next.js Stack)    
echo ==============================================

echo [1/3] Starting Next.js Frontend Server (Port 3000)...
start "RehabFrontend" cmd /k "cd RehabApp\frontend && npm run dev"

echo [2/3] Starting MediaPipe Backend (Port 8765)...
start "RehabBackend" cmd /k "cd RehabApp\backend && py main.py"

echo [3/3] Opening Dashboard in Default Browser...
start "" http://localhost:3000

echo.
echo Launch sequence complete! The terminal windows will remain open to log data.
echo Run 'stop.bat' to safely close everything and release your webcam.
echo ==============================================
