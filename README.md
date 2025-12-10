# Setu AI - Omnichannel Conversational Retail Assistant

A complete full-stack prototype for an AI-powered retail assistant built for ABFRL. This project simulates the end-to-end customer journey from chat interactions to virtual try-on to checkout.

## 🎯 Features

- **AI Chat Assistant**: Conversational interface with rule-based recommendations
- **Virtual Try-On**: Mock virtual try-on with product overlay visualization
- **Product Catalog**: Browse products with stock checking and checkout
- **Worker Agents**: 
  - 🎯 Recommendation Agent
  - 📦 Inventory Agent
  - 💳 Payment Agent (Mock)
  - 🚚 Fulfillment Agent
  - ⭐ Loyalty Agent
- **Guided Demo Mode**: Auto-play complete shopping journey
- **Session Management**: Persistent chat history and preferences

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, TailwindCSS, Axios
- **Backend**: FastAPI (Python), Uvicorn
- **Data Storage**: Local JSON files (simulating database)

## 📦 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **npm** or **yarn** (comes with Node.js)

### Step 1: Clone/Download the Project

```bash
cd Setu-ai
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Step 3: Frontend Setup

1. Navigate to frontend directory (from project root):
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

## 🚀 Running the Project

### Start Backend Server

1. Open a terminal/command prompt
2. Navigate to backend directory:
```bash
cd backend
```

3. Activate virtual environment (if using one):
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Start FastAPI server:
```bash
uvicorn main:app --reload
```

The backend will run on: **http://localhost:8000**

You can test the API at: **http://localhost:8000/docs** (Swagger UI)

### GenAI (LLM) Configuration

- Set your Google GenAI API key (Gemini):
  - Windows PowerShell:
    ```powershell
    $env:GOOGLE_GENAI_API_KEY="YOUR_KEY_HERE"
    ```
  - macOS/Linux:
    ```bash
    export GOOGLE_GENAI_API_KEY="YOUR_KEY_HERE"
    ```
- The chat UI uses `POST /chat-llm`. If the key is not set, chat falls back to rule-based responses.

### Start Frontend Server

1. Open a **NEW** terminal/command prompt
2. Navigate to frontend directory:
```bash
cd frontend
```

3. Start React development server:
```bash
npm start
```

The frontend will run on: **http://localhost:3000**

The browser should automatically open. If not, navigate to http://localhost:3000 manually.

## 📋 Required Packages

### Backend Packages (Python)

All packages are listed in `backend/requirements.txt`:

- **fastapi** (0.104.1) - Web framework for building APIs
- **uvicorn[standard]** (0.24.0) - ASGI server for running FastAPI
- **python-multipart** (0.0.6) - For handling form data
- **pydantic** (2.5.0) - Data validation using Python type annotations

**Installation:**
```bash
pip install -r backend/requirements.txt
```

### Frontend Packages (Node.js)

All packages are listed in `frontend/package.json`:

**Dependencies:**
- **react** (^18.2.0) - React library
- **react-dom** (^18.2.0) - React DOM rendering
- **react-router-dom** (^6.20.0) - Client-side routing
- **react-scripts** (5.0.1) - Create React App scripts
- **axios** (^1.6.2) - HTTP client for API calls

**Dev Dependencies:**
- **tailwindcss** (^3.3.6) - Utility-first CSS framework
- **autoprefixer** (^10.4.16) - CSS vendor prefixer
- **postcss** (^8.4.32) - CSS transformation tool

**Installation:**
```bash
npm install
```

## 🎨 Project Structure

```
Setu-ai/
├── backend/
│   ├── data/
│   │   ├── products.json          # Product catalog data
│   │   ├── inventory.json         # Inventory/stock data
│   │   └── user_profiles.json     # User profiles and preferences
│   ├── main.py                    # FastAPI application
│   └── requirements.txt           # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── DemoMode.js       # Guided demo component
│   │   ├── pages/
│   │   │   ├── HomePage.js       # Landing page
│   │   │   ├── ChatPage.js       # Chat interface
│   │   │   ├── VirtualTryOnPage.js  # Try-on feature
│   │   │   └── ProductCatalogPage.js # Product catalog
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # App styles
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Node.js dependencies
│   ├── tailwind.config.js        # TailwindCSS configuration
│   └── postcss.config.js         # PostCSS configuration
│
└── README.md                     # This file
```

## 🎬 Using the Application

### Home Page
- Click **"Start Chat"** to begin conversation with Setu AI
- Click **"Virtual Try-On"** to try products virtually
- Click **"View Product Catalog"** to browse all products
- Click **"Run Guided Demo"** to see the complete journey

### Chat Page
- Type messages to interact with Setu AI
- Try commands like:
  - "Show me shirts"
  - "Check stock"
  - "Virtual try-on"
  - "Check my loyalty points"
- Chat history is saved in browser localStorage

### Virtual Try-On Page
- Select a product from the grid
- See "Before" and "After" comparison
- View fit rating and recommendations

### Product Catalog Page
- Browse all available products
- Click **"Try On"** to go to virtual try-on
- Click **"Check Stock"** to see availability
- Click **"Buy Now"** to checkout

### Demo Mode
- Click **"Run Guided Demo"** on home page
- Watch the complete shopping journey:
  1. Greeting
  2. Product recommendation
  3. Stock check
  4. Virtual try-on
  5. Checkout
  6. Loyalty points application
  7. Order confirmation

## 🎨 Color Scheme (ABFRL Style)

- **Primary Green**: `#1a5f3f` (abfrl-green)
- **Dark Green**: `#0d3d26` (abfrl-dark-green)
- **Gold Accent**: `#d4af37` (abfrl-gold)
- **Light Gold**: `#f4e4bc` (abfrl-light-gold)
- **White**: `#ffffff`
- **Black**: `#000000`

## 🔧 API Endpoints

All endpoints are available at `http://localhost:8000`:

- `GET /` - API status
- `GET /products` - Get all products
- `GET /products/{product_id}` - Get specific product
- `POST /recommend` - Get product recommendations
- `POST /inventory` - Check product inventory
- `POST /checkout` - Process checkout (mock payment)
- `POST /apply-loyalty` - Apply loyalty points
- `POST /fulfillment` - Process fulfillment (delivery/pickup)
- `POST /virtual-tryon-mock` - Virtual try-on simulation
- `GET /user/{user_id}` - Get user profile

API documentation available at: `http://localhost:8000/docs`

## 🐛 Troubleshooting

### Backend Issues

1. **Port 8000 already in use:**
   ```bash
   # Change port in main.py or use:
   uvicorn main:app --reload --port 8001
   ```

2. **Module not found errors:**
   ```bash
   # Make sure virtual environment is activated
   pip install -r requirements.txt
   ```

3. **JSON file errors:**
   - Ensure `backend/data/` directory exists
   - Check that JSON files are valid

### Frontend Issues

1. **Port 3000 already in use:**
   - React will prompt to use another port (usually 3001)
   - Or stop the process using port 3000

2. **Module not found errors:**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS errors:**
   - Ensure backend is running on port 8000
   - Check `API_BASE_URL` in `frontend/src/services/api.js`

4. **TailwindCSS not working:**
   ```bash
   # Rebuild TailwindCSS
   npm run build
   ```

## 📝 Notes

- This is a **prototype** with mock data and simulated AI
- No real payment processing - all payments are simulated
- Virtual try-on uses simple image overlay (not real ML)
- Chat uses rule-based logic (not real AI/NLP)
- All data is stored in local JSON files (no database)

## 🎯 Future Enhancements

- Real ML-based virtual try-on
- Integration with actual payment gateways
- Real-time inventory updates
- User authentication
- Database integration
- Real AI/NLP for chat

## 👨‍💻 Development

### Making Changes

1. **Backend changes**: Edit files in `backend/` - server auto-reloads
2. **Frontend changes**: Edit files in `frontend/src/` - React auto-reloads

### Adding New Products

Edit `backend/data/products.json` and add new product objects following the existing structure.

### Modifying Chat Responses

Edit the `processUserInput` function in `frontend/src/pages/ChatPage.js`.

## 📄 License

This project is a prototype for demonstration purposes.

---

**Built with ❤️ for ABFRL Hackathon**


