# 🚀 Quick Start Guide - Setu AI

## ⚡ Fastest Way to Run

### Option 1: Using Scripts (Recommended)

**Windows:**
1. Double-click `start-backend.bat` (opens backend server)
2. Double-click `start-frontend.bat` (opens frontend in new window)

**Mac/Linux:**
1. Open terminal and run: `chmod +x start-backend.sh start-frontend.sh`
2. Run: `./start-backend.sh` (in one terminal)
3. Run: `./start-frontend.sh` (in another terminal)

### Option 2: Manual Setup

#### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

## ✅ Verify It's Working

1. Backend: Open http://localhost:8000/docs (should see API docs)
2. Frontend: Open http://localhost:3000 (should see home page)

## 🎬 Try the Demo

1. Click **"Run Guided Demo"** button on home page
2. Watch the complete shopping journey!

## 📦 What Gets Installed

### Backend (Python)
- fastapi
- uvicorn
- pydantic
- python-multipart

### Frontend (Node.js)
- react
- react-router-dom
- axios
- tailwindcss
- And dependencies...

## ⚠️ Troubleshooting

**Backend won't start?**
- Make sure Python 3.8+ is installed
- Check if port 8000 is free
- Try: `python --version`

**Frontend won't start?**
- Make sure Node.js 16+ is installed
- Check if port 3000 is free
- Try: `node --version` and `npm --version`

**CORS errors?**
- Make sure backend is running first
- Check backend is on port 8000

## 🎯 Next Steps

1. Explore the home page
2. Try the chat feature
3. Test virtual try-on
4. Browse the catalog
5. Run the guided demo!

---

**Need help?** Check the main README.md for detailed documentation.


