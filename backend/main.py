"""
Setu AI Backend API
FastAPI backend for omnichannel conversational retail assistant
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import random
import os
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

app = FastAPI(title="Setu AI API", version="1.0.0")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data files
def load_json(file_path: str):
    """Load JSON data from file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Request/Response Models
class RecommendationRequest(BaseModel):
    category: Optional[str] = None
    user_input: Optional[str] = None
    user_id: Optional[str] = "user_001"

class InventoryRequest(BaseModel):
    product_id: int

class CheckoutRequest(BaseModel):
    product_id: int
    size: str
    payment_method: str
    upi_id: Optional[str] = None
    card_number: Optional[str] = None
    user_id: str = "user_001"

class LoyaltyRequest(BaseModel):
    user_id: str
    order_amount: float

class FulfillmentRequest(BaseModel):
    order_id: str
    fulfillment_type: str  # "home_delivery" or "store_pickup"
    address: Optional[str] = None
    store_location: Optional[str] = None

class VirtualTryOnRequest(BaseModel):
    product_id: int
    model_image_url: Optional[str] = None
    user_image_url: Optional[str] = None  # required for dynamic try-on

class ChatLLMRequest(BaseModel):
    message: str
    history: Optional[List[str]] = None
    user_id: Optional[str] = "user_001"
    include_products: bool = False

# API Endpoints

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "Setu AI Backend API", "status": "running"}

@app.get("/products")
def get_products():
    """Get all products"""
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    return {"products": products}

@app.get("/products/{product_id}")
def get_product(product_id: int):
    """Get specific product by ID"""
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": product}

@app.post("/recommend")
def recommend_products(request: RecommendationRequest):
    """
    Recommendation Agent
    Recommends products based on category or user input
    """
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    
    # Get user preferences if available
    user_profiles = load_json(os.path.join(DATA_DIR, 'user_profiles.json'))
    user_profile = next((u for u in user_profiles if u['user_id'] == request.user_id), None)
    
    recommended = []
    
    if request.category:
        # Filter by category
        recommended = [p for p in products if p['category'].lower() == request.category.lower()]
    elif request.user_input:
        # Simple keyword matching
        user_input_lower = request.user_input.lower()
        for product in products:
            if (user_input_lower in product['name'].lower() or 
                user_input_lower in product['category'].lower() or
                user_input_lower in product['color'].lower()):
                recommended.append(product)
    elif user_profile:
        # Use user preferences
        preferred_categories = user_profile.get('preferences', {}).get('categories', [])
        for product in products:
            if product['category'] in preferred_categories:
                recommended.append(product)
    
    # If no matches, return random products
    if not recommended:
        recommended = random.sample(products, min(3, len(products)))
    
    return {
        "recommendations": recommended[:5],  # Return top 5
        "message": f"Found {len(recommended)} recommendations for you!"
    }

@app.post("/inventory")
def check_inventory(request: InventoryRequest):
    """
    Inventory Agent
    Checks product availability in online and store stock
    """
    inventory_data = load_json(os.path.join(DATA_DIR, 'inventory.json'))
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    
    inventory = next((inv for inv in inventory_data if inv['product_id'] == request.product_id), None)
    product = next((p for p in products if p['id'] == request.product_id), None)
    
    if not inventory:
        raise HTTPException(status_code=404, detail="Product inventory not found")
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {
        "product_id": request.product_id,
        "product_name": product['name'],
        "online_stock": inventory['online_stock'],
        "store_stock": inventory['store_stock'],
        "available": inventory['online_stock'] > 0 or any(stock > 0 for stock in inventory['store_stock'].values()),
        "message": f"{product['name']} - Online: {inventory['online_stock']} units available"
    }

@app.post("/checkout")
def process_checkout(request: CheckoutRequest):
    """
    Payment Agent (Mock)
    Simulates payment processing
    """
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    product = next((p for p in products if p['id'] == request.product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Mock payment processing - 90% success rate
    payment_success = random.random() > 0.1
    
    order_id = f"ORD{random.randint(100000, 999999)}"
    
    if payment_success:
        return {
            "status": "success",
            "message": "Payment Successful!",
            "order_id": order_id,
            "product": product['name'],
            "size": request.size,
            "amount": product['price'],
            "payment_method": request.payment_method,
            "timestamp": datetime.now().isoformat()
        }
    else:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "failed",
                "message": "Payment Failed. Please try again.",
                "order_id": None
            }
        )

@app.post("/apply-loyalty")
def apply_loyalty(request: LoyaltyRequest):
    """
    Loyalty Agent
    Applies loyalty points discount
    """
    user_profiles = load_json(os.path.join(DATA_DIR, 'user_profiles.json'))
    user_profile = next((u for u in user_profiles if u['user_id'] == request.user_id), None)
    
    if not user_profile:
        return {
            "loyalty_points": 0,
            "discount": 0,
            "discount_amount": 0,
            "message": "No loyalty points available"
        }
    
    loyalty_points = user_profile.get('loyalty_points', 0)
    # 1 point = ₹0.5 discount
    discount_amount = min(loyalty_points * 0.5, request.order_amount * 0.3)  # Max 30% discount
    discount_points_used = int(discount_amount / 0.5)
    
    return {
        "loyalty_points": loyalty_points,
        "discount_points_used": discount_points_used,
        "discount_amount": round(discount_amount, 2),
        "final_amount": round(request.order_amount - discount_amount, 2),
        "message": f"Applied {discount_points_used} loyalty points for ₹{discount_amount:.2f} discount"
    }

@app.post("/fulfillment")
def process_fulfillment(request: FulfillmentRequest):
    """
    Fulfillment Agent
    Handles delivery or pickup options
    """
    if request.fulfillment_type == "home_delivery":
        if not request.address:
            raise HTTPException(status_code=400, detail="Address required for home delivery")
        
        estimated_delivery = (datetime.now().day % 7) + 2  # 2-8 days
        return {
            "fulfillment_type": "home_delivery",
            "order_id": request.order_id,
            "address": request.address,
            "estimated_delivery_days": estimated_delivery,
            "status": "confirmed",
            "message": f"Order will be delivered to your address in {estimated_delivery} days"
        }
    
    elif request.fulfillment_type == "store_pickup":
        if not request.store_location:
            raise HTTPException(status_code=400, detail="Store location required for pickup")
        
        return {
            "fulfillment_type": "store_pickup",
            "order_id": request.order_id,
            "store_location": request.store_location,
            "pickup_date": (datetime.now().day % 3) + 1,  # 1-3 days
            "status": "confirmed",
            "message": f"Order ready for pickup at {request.store_location} in 1-3 days"
        }
    
    else:
        raise HTTPException(status_code=400, detail="Invalid fulfillment type")

@app.post("/virtual-tryon-mock")
def virtual_tryon(request: VirtualTryOnRequest):
    """
    Virtual Try-On Mock
    Simulates virtual try-on feature
    """
    products = load_json(os.path.join(DATA_DIR, 'products.json'))
    product = next((p for p in products if p['id'] == request.product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not request.user_image_url:
        raise HTTPException(status_code=400, detail="Please provide user_image_url (uploaded image) for try-on")

    # Mock try-on result referencing provided user image
    return {
        "product_id": request.product_id,
        "product_name": product['name'],
        "tryon_status": "success",
        "preview_url": product['image'],  # Placeholder; real impl would merge with user image
        "user_image_url": request.user_image_url,
        "message": f"Virtual try-on preview generated for {product['name']} using your photo",
        "fit_rating": random.choice(["Perfect Fit", "Good Fit", "Slightly Loose", "Slightly Tight"]),
        "recommendation": random.choice(["Looks great!", "Try a different size", "Perfect match!"])
    }

@app.get("/user/{user_id}")
def get_user_profile(user_id: str):
    """Get user profile"""
    user_profiles = load_json(os.path.join(DATA_DIR, 'user_profiles.json'))
    user_profile = next((u for u in user_profiles if u['user_id'] == user_id), None)
    
    if not user_profile:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"user": user_profile}

@app.post("/chat-llm")
def chat_llm(request: ChatLLMRequest):
    """
    LLM-powered chat using Google GenAI (Gemini).
    Falls back to a simple rule-based reply if API key is missing.
    """
    api_key = os.getenv("GOOGLE_GENAI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {
            "message": "LLM is not configured. Please set GOOGLE_GENAI_API_KEY.",
            "reply": "I'm running in offline mode. Tell me a category (like shirts or blazers) and I'll recommend items!",
            "llm_used": False,
        }

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")

        parts = []
        if request.include_products:
            products = load_json(os.path.join(DATA_DIR, "products.json"))
            inventory = load_json(os.path.join(DATA_DIR, "inventory.json"))
            product_lines = []
            for p in products[:12]:  # keep prompt concise
                inv = next((i for i in inventory if i["product_id"] == p["id"]), None)
                online = inv["online_stock"] if inv else "N/A"
                product_lines.append(
                    f"- {p['name']} (id:{p['id']}, category:{p['category']}, color:{p['color']}, price:₹{p['price']}, stock:{online})"
                )
            catalog_summary = "\n".join(product_lines)
            system_prompt = (
                "You are Setu AI, a retail assistant for ABFRL. Be concise, friendly, and recommend only from the catalog below. "
                "If user mentions shirts/blazers/jeans/etc., pick matching items. "
                "Always end with a short CTA: 'Open catalog' pointing to /catalog.\n"
                "Catalog:\n"
                f"{catalog_summary}"
            )
            parts.append(system_prompt)

        if request.history:
            parts.extend(request.history[-6:])  # include recent context
        parts.append(request.message)

        response = model.generate_content(parts, safety_settings={
            "HARASSMENT": "BLOCK_NONE",
            "HATE_SPEECH": "BLOCK_NONE",
            "SEXUAL": "BLOCK_NONE",
            "DANGEROUS": "BLOCK_NONE",
        })

        reply_text = response.text if hasattr(response, "text") else "I’m here to help with products, stock, and try-ons!"

        return {
            "message": "LLM response generated",
            "reply": reply_text,
            "llm_used": True,
        }
    except Exception as e:
        return {
            "message": "LLM call failed, falling back",
            "reply": "I’m here to help with products, stock, and try-ons! Tell me what you need.",
            "llm_used": False,
            "error": str(e),
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


