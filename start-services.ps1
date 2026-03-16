Write-Host "========================================"
Write-Host "   Starting Company AI System"
Write-Host "========================================"
Write-Host ""

Write-Host "[1/2] Starting Backend Server..."
Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory "$PSScriptRoot\server" -WindowStyle Normal

Write-Host "[2/2] Starting Frontend Development Server..."
Start-Process -FilePath "node" -ArgumentList "node_modules/vite/bin/vite.js", "--port", "5173" -WorkingDirectory "$PSScriptRoot" -WindowStyle Normal

Write-Host ""
Write-Host "========================================"
Write-Host "   Services Started!"
Write-Host "========================================"
Write-Host ""
Write-Host "Backend Server: http://localhost:3001"
Write-Host "Frontend Server: http://localhost:5173"
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
