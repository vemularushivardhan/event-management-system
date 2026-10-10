@echo off
TITLE Event Management System Launcher
color 0B
echo ======================================================================
echo           EVENT MANAGEMENT & REGISTRATION SYSTEM LAUNCHER
echo ======================================================================
echo.
echo [1/2] Starting Spring Boot 3 Backend on http://localhost:8080 ...
start "Backend - Spring Boot 3 [Port 8080]" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo.
echo [2/2] Starting React Frontend on http://localhost:3000 ...
start "Frontend - React 18 [Port 3000]" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ======================================================================
echo  Servers are starting in separate terminal windows!
echo.
echo  * Frontend Web Application : http://localhost:3000
echo  * Backend REST API         : http://localhost:8080
echo.
echo  Default Admin Credentials:
echo    Email    : admin@eventmanagement.com
echo    Password : Admin@123
echo.
echo  Default User Credentials:
echo    Email    : alice.johnson@example.com
echo    Password : Password@123
echo ======================================================================
echo.
pause
