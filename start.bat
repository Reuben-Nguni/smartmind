@echo off
REM SmartMind LMS - Quick Start Script for Windows
REM This script starts both backend and frontend servers

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo SmartMind LMS - Starting Application
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js version: %NODE_VERSION%
echo npm version: %NPM_VERSION%
echo.

REM Backend startup
echo Starting Backend Server...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo Warning: .env file not found in backend directory
    echo Please create .env file with the following variables:
    echo   PORT=5000
    echo   MONGODB_URI=^<your_mongodb_connection_string^>
    echo   JWT_SECRET=^<your_jwt_secret^>
    echo   CLOUDINARY_CLOUD_NAME=^<your_cloud_name^>
    echo   CLOUDINARY_API_KEY=^<your_api_key^>
    echo   CLOUDINARY_API_SECRET=^<your_api_secret^>
    echo.
    pause
)

REM Start backend
start "SmartMind Backend" npm run dev
echo Backend started
echo   Running on: http://localhost:5000
echo.

REM Frontend startup
echo Starting Frontend Server...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend
start "SmartMind Frontend" npm run dev
echo Frontend started
echo   Running on: http://localhost:3000
echo.

echo ==========================================
echo Both servers are starting!
echo ==========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo.
echo Default Admin Credentials:
echo   Email: admin@smartmind.com
echo   Password: admin123
echo.
echo To stop the servers, close the command windows.
echo.

timeout /t 5
