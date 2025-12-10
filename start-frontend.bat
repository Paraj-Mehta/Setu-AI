@echo off
echo Starting Setu AI Frontend Server...
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Frontend starting on http://localhost:3000
call npm start
pause


