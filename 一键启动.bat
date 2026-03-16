@echo off
chcp 65001 >nul
echo ========================================
echo     公司AI系统 - 一键启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查端口占用情况...
netstat -ano | findstr :3001 >nul
if %errorlevel% == 0 (
    echo   端口 3001 已被占用，正在停止旧进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

netstat -ano | findstr :5173 >nul
if %errorlevel% == 0 (
    echo   端口 5173 已被占用，正在停止旧进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo   端口检查完成！
echo.

echo [2/3] 启动后端服务器...
start "后端服务器 - 端口3001" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 3 /nobreak >nul

echo [3/3] 启动前端开发服务器...
start "前端开发服务器 - 端口5173" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo     启动完成！
echo ========================================
echo.
echo 后端地址: http://localhost:3001
echo 前端地址: http://localhost:5173
echo.
echo 提示：关闭此窗口不会停止服务
echo       要停止服务，请关闭另外两个命令行窗口
echo.
pause