@echo off
echo Starting CPUT Marketplace and Exchange...
echo.
echo Checking if server directory exists...
if not exist "server" (
    echo Error: server directory not found!
    echo Please make sure you're in the correct project directory.
    pause
    exit /b 1
)

echo Starting MySQL database (if not already running)...
echo If you get an error, make sure MySQL is installed and running.
echo.

echo Starting Node.js server...
cd server
node server.js

pause