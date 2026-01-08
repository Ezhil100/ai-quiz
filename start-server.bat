@echo off
title AI Quiz - Mobile Server
color 0B
echo.
echo ========================================
echo   AI QUIZ - MOBILE ACCESS SERVER
echo ========================================
echo.
echo Finding your IP address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP:~1%
echo [SUCCESS] Your IP: %IP%
echo.
echo Mobile Access URL:
echo    http://%IP%:8080
echo.
echo Instructions:
echo  1. Make sure phone is on SAME WiFi
echo  2. Open browser on phone
echo  3. Go to: http://%IP%:8080
echo.
echo [TIP] Your current IP: 10.30.96.143
echo.
echo Starting server...
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

python -m http.server 8080 --bind 0.0.0.0

if errorlevel 1 (
    echo.
    echo [ERROR] Python not found!
    echo Please install Python from: https://www.python.org/downloads/
    echo.
    pause
)
