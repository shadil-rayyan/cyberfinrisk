@echo off
echo Starting CyberFinRisk...
echo.

REM Start backend in a new window
start "CyberFinRisk Backend" cmd /k "cd /d "D:\Hobby projects\cyberfinrisk\backend" && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

REM Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "CyberFinRisk Frontend" cmd /k "cd /d "D:\Hobby projects\cyberfinrisk\frontend" && npm run dev"

echo Both servers started!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
