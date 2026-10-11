@echo off
cd /d "%~dp0"
title Estetica Mariana Costa - servidor local
where node >nul 2>nul
if %errorlevel%==0 (
  node server.js --open
) else (
  echo Node.js nao encontrado. Tentando com Python...
  start "" http://localhost:3000
  python -m http.server 3000
)
pause
