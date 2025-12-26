@echo off
start "Watch Process" cmd /k npm run watch
start "Dev Process" cmd /k npm run dev
start "SSL Process" cmd /k npm run ssldev
echo Both processes started successfully
pause