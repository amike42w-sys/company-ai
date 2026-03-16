@echo off
echo ========================================
echo    启动公司AI系统
echo ========================================
echo.

echo [1/2] 启动后端服务器...
start "后端服务器" cmd /k "cd /d %~dp0server && npm install && npm start"
timeout /t 3 /nobreak > nul

echo [2/2] 启动前端开发服务器...
start "前端开发服务器" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo    启动完成！
echo    后端服务器: http://localhost:3001
echo    前端应用: http://localhost:5173
echo ========================================
echo.
echo 请等待服务启动完成后访问上述地址
pause
