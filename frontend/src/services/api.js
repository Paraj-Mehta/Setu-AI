/**
 * API Service for Setu AI
 * Handles all backend API calls
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const getProducts = () => api.get('/products');
export const getProduct = (productId) => api.get(`/products/${productId}`);

// Recommendation Agent
export const getRecommendations = (category, userInput, userId = 'user_001') => 
  api.post('/recommend', { category, user_input: userInput, user_id: userId });

// Inventory Agent
export const checkInventory = (productId) => 
  api.post('/inventory', { product_id: productId });

// Payment Agent
export const processCheckout = (productId, size, paymentMethod, upiId = null, cardNumber = null, userId = 'user_001') =>
  api.post('/checkout', {
    product_id: productId,
    size,
    payment_method: paymentMethod,
    upi_id: upiId,
    card_number: cardNumber,
    user_id: userId,
  });

// Loyalty Agent
export const applyLoyalty = (userId, orderAmount) =>
  api.post('/apply-loyalty', { user_id: userId, order_amount: orderAmount });

// Fulfillment Agent
export const processFulfillment = (orderId, fulfillmentType, address = null, storeLocation = null) =>
  api.post('/fulfillment', {
    order_id: orderId,
    fulfillment_type: fulfillmentType,
    address,
    store_location: storeLocation,
  });

// Virtual Try-On
export const virtualTryOn = (productId, modelImageUrl = null, userImageUrl = null) =>
  api.post('/virtual-tryon-mock', { product_id: productId, model_image_url: modelImageUrl, user_image_url: userImageUrl });

// LLM Chat (Google GenAI backend proxy)
export const chatWithLLM = (message, history = [], userId = 'user_001', includeProducts = false) =>
  api.post('/chat-llm', { message, history, user_id: userId, include_products: includeProducts });

// User Profile
export const getUserProfile = (userId) => api.get(`/user/${userId}`);

export default api;


