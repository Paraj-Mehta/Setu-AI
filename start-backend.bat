@echo off
echo Starting Setu AI Backend Server...
cd backend
python -m venv venv 2>nul
call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
echo Backend starting on http://localhost:8000
uvicorn main:app --reload
pause


