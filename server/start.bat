@echo off
echo ========================================
echo    安装后端依赖...
echo ========================================
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [错误] npm install 失败！
    echo 请尝试以下方法：
    echo 1. 以管理员身份运行此脚本
    echo 2. 或者手动运行: npm cache clean --force
    echo 3. 然后重新运行此脚本
    pause
    exit /b 1
)

echo.
echo ========================================
echo    启动后端服务器...
echo ========================================
call npm start
