@echo off
REM SmartFix Setup Script for Windows

echo.
echo ============================================
echo   SmartFix Setup Script
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 18 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Backend Setup
echo.
echo Setting up Backend...
cd backend
call npm install
call npm run seed
echo [OK] Backend ready ^(port 5000^)
cd ..

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend
call npm install
echo [OK] Frontend ready ^(port 5173^)
cd ..

REM Admin Setup
echo.
echo Setting up Admin...
cd admin
call npm install
echo [OK] Admin ready ^(port 5174^)
cd ..

echo.
echo ============================================
echo   SmartFix Setup Complete!
echo ============================================
echo.
echo To start development:
echo   Terminal 1: cd backend ^&^& npm start
echo   Terminal 2: cd frontend ^&^& npm run dev
echo   Terminal 3: cd admin ^&^& npm run dev
echo.
echo Access:
echo   Frontend: http://localhost:5173
echo   Admin: http://localhost:5174 ^(admin@smartfix.local / admin123^)
echo   API: http://localhost:5000
echo.
