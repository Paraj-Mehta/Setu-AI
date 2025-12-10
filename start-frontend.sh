#!/bin/bash
echo "Starting Setu AI Frontend Server..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Frontend starting on http://localhost:3000"
npm start


