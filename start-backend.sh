#!/bin/bash
echo "Starting Setu AI Backend Server..."
cd backend
python3 -m venv venv 2>/dev/null
source venv/bin/activate
pip install -r requirements.txt >/dev/null 2>&1
echo "Backend starting on http://localhost:8000"
uvicorn main:app --reload


