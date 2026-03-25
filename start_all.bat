@echo off
title AquaWatch — Water Monitoring System
color 0B

echo.
echo  ========================================================
echo   AquaWatch — CV-Based Water Monitoring System
echo   Academic Prototype v1.0
echo  ========================================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Please install Python 3.11+
    pause & exit /b 1
)

:: Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Please install Node.js 18+
    pause & exit /b 1
)

echo  [1/4] Setting up Python virtual environment...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat

echo  [2/4] Installing backend dependencies...
pip install -r requirements.txt --quiet

echo  [3/4] Starting backend server (port 8000)...
start "AquaWatch Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo   Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo  [4/4] Installing and starting frontend...
cd ..\frontend
if not exist node_modules (
    echo   Installing npm packages (first run only)...
    npm install
)
start "AquaWatch Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  ========================================================
echo   AquaWatch is starting!
echo.
echo   Backend API:  http://localhost:8000
echo   API Docs:     http://localhost:8000/docs
echo   Frontend:     http://127.0.0.1:5173
echo  ========================================================
echo.

timeout /t 6 /nobreak >nul
start http://127.0.0.1:5173

echo  Both servers are running in separate windows.
echo  Close those windows to stop the application.
echo.
pause
