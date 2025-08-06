@echo off
echo ================================================
echo    🚀 INICIANDO CAFE 24H - SISTEMA COMPLETO
echo ================================================
echo.

echo 📋 Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️  Instalando dependencias do frontend...
    call npm install
)

if not exist "backend\node_modules" (
    echo ⚠️  Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

echo.
echo ✅ Dependencias verificadas!
echo.

echo 🔥 Iniciando servidores...
echo.

echo 📡 Iniciando API Backend (Porta 3001)...
start "🔧 API Backend" cmd /k "cd backend && node server-complete.js"

timeout /t 3 >nul

echo 🌐 Iniciando Frontend React (Porta 3000)...
start "⚛️  Frontend React" cmd /k "npm start"

echo.
echo ================================================
echo   ✨ SISTEMA INICIADO COM SUCESSO!
echo ================================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 📡 API:      http://localhost:3001
echo.
echo 💡 Pressione qualquer tecla para abrir o sistema no navegador...
pause >nul

start http://localhost:3000

echo.
echo 🎉 Sistema aberto! Pressione CTRL+C nos terminais para parar.
echo.
pause