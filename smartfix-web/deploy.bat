@echo off
REM CivicSense Deployment Script for Windows
REM Usage: deploy.bat [vercel|render|heroku]

setlocal enabledelayedexpansion

set TARGET=%1
if "%TARGET%"=="" set TARGET=vercel

echo.
echo 🚀 CivicSense Deployment Script
echo ================================
echo Target: %TARGET%
echo.

REM Check git status
for /f %%i in ('git status -s') do (
    echo ❌ Error: Uncommitted changes detected
    echo Please commit all changes before deploying
    exit /b 1
)

echo 📦 Installing dependencies...
call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ Dependency installation failed
    exit /b 1
)

echo.
echo 🔨 Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo.

if "%TARGET%"=="vercel" (
    echo 📤 Deploying to Vercel...
    where vercel >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing Vercel CLI...
        npm install -g vercel
    )
    call vercel --prod
) else if "%TARGET%"=="render" (
    echo 📤 Deploying to Render...
    echo Please deploy using the Render dashboard:
    echo 1. Go to render.com
    echo 2. Connect your repository
    echo 3. Deploy will start automatically
    echo.
    echo Or use git push:
    echo git push render main
) else if "%TARGET%"=="heroku" (
    echo 📤 Deploying to Heroku...
    where heroku >nul 2>nul
    if %errorlevel% neq 0 (
        echo ❌ Heroku CLI not found
        echo Install from: https://devcenter.heroku.com/articles/heroku-cli
        exit /b 1
    )
    call git push heroku main
    call heroku logs --tail
) else (
    echo ❌ Unknown target: %TARGET%
    echo Usage: deploy.bat [vercel^|render^|heroku]
    exit /b 1
)

echo.
echo ✅ Deployment script completed!
echo.

endlocal
