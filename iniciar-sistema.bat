@echo off
title Cafe24h - Sistema de Cafeteria
color 0A

cls
echo.
echo ═══════════════════════════════════════════════════════════
echo                    ☕ CAFE24H - SISTEMA DE CAFETERIA
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 Iniciando o sistema...
echo.

echo 📡 Iniciando Backend API...
start "🔧 Backend API - Cafe24h" cmd /k "echo ═══ BACKEND API ═══ && echo 📡 Servidor rodando em http://localhost:3001 && echo. && node server-complete.js"

echo ⏳ Aguardando backend inicializar...
timeout /t 4 >nul

echo 🌐 Iniciando Frontend React...
start "🖥️ Frontend React - Cafe24h" cmd /k "echo ═══ FRONTEND REACT ═══ && echo 🌐 Aplicação rodando em http://localhost:3000 && echo. && npm start"

echo.
echo ✅ Sistema Cafe24h iniciado com sucesso!
echo.
echo 📋 INFORMAÇÕES DE ACESSO:
echo    🌐 Frontend: http://localhost:3000
echo    📡 API:      http://localhost:3001
echo.
echo 📝 TERMINAIS ABERTOS:
echo    🔧 Backend API
echo    🖥️ Frontend React
echo.
echo 💡 Para parar o sistema, feche os terminais abertos.
echo.
pause
