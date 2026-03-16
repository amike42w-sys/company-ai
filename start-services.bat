@echo off
echo ========================================
echo    Starting Company AI System
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start /b "Backend Server" cmd /c "cd /d %~dp0server && node index.js"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Development Server...
start /b "Frontend Server" cmd /c "cd /d %~dp0 && node node_modules/vite/bin/vite.js --port 5173"

echo.
echo ========================================
echo    Services Started!
echo ========================================
echo.
echo Backend Server: http://localhost:3001
echo Frontend Server: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
