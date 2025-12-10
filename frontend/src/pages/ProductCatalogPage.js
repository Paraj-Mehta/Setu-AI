import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, checkInventory, processCheckout, applyLoyalty, processFulfillment } from '../services/api';

const ProductCatalogPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    size: '',
    paymentMethod: 'UPI',
    upiId: '',
    cardNumber: '',
  });
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleCheckStock = async (productId) => {
    try {
      const response = await checkInventory(productId);
      setInventory(response.data);
      setSelectedProduct(products.find(p => p.id === productId));
    } catch (error) {
      console.error('Error checking inventory:', error);
      alert('Error checking stock');
    }
  };

  const handleTryOn = (product) => {
    navigate('/try-on', { state: { product } });
  };

  const handleCheckout = (product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
    setOrderResult(null);
    setCheckoutData({
      size: product.sizes[0] || '',
      paymentMethod: 'UPI',
      upiId: '',
      cardNumber: '',
    });
  };

  const processOrder = async () => {
    if (!checkoutData.size) {
      alert('Please select a size');
      return;
    }

    if (checkoutData.paymentMethod === 'UPI' && !checkoutData.upiId) {
      alert('Please enter UPI ID');
      return;
    }

    if (checkoutData.paymentMethod === 'Card' && !checkoutData.cardNumber) {
      alert('Please enter card number');
      return;
    }

    try {
      // Process checkout
      const checkoutResponse = await processCheckout(
        selectedProduct.id,
        checkoutData.size,
        checkoutData.paymentMethod,
        checkoutData.upiId,
        checkoutData.cardNumber
      );

      // Apply loyalty points
      const loyaltyResponse = await applyLoyalty('user_001', selectedProduct.price);

      // Process fulfillment
      const fulfillmentResponse = await processFulfillment(
        checkoutResponse.data.order_id,
        'home_delivery',
        '123 Main Street, City'
      );

      setOrderResult({
        orderId: checkoutResponse.data.order_id,
        product: selectedProduct.name,
        size: checkoutData.size,
        amount: loyaltyResponse.data.final_amount,
        discount: loyaltyResponse.data.discount_amount,
        fulfillment: fulfillmentResponse.data,
      });
    } catch (error) {
      if (error.response?.data?.detail?.status === 'failed') {
        alert('Payment failed. Please try again.');
      } else {
        alert('Error processing order. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="text-abfrl-green hover:text-abfrl-dark-green">
                ← Back
              </button>
              <h1 className="text-xl font-bold text-abfrl-dark-green">Product Catalog</h1>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="btn-secondary text-sm"
            >
              💬 Chat with Setu AI
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Inventory Modal */}
        {inventory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-abfrl-dark-green">Stock Availability</h3>
                <button onClick={() => setInventory(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">{inventory.product_name}</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-semibold mb-2">
                      ✅ Online Stock: {inventory.online_stock} units
                    </p>
                    <div className="mt-3">
                      <p className="font-semibold text-gray-700 mb-2">Store Stock:</p>
                      <ul className="space-y-1">
                        <li>Store 1: {inventory.store_stock.store_1} units</li>
                        <li>Store 2: {inventory.store_stock.store_2} units</li>
                        <li>Store 3: {inventory.store_stock.store_3} units</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button onClick={() => setInventory(null)} className="btn-primary w-full">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && selectedProduct && !orderResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-abfrl-dark-green">Checkout</h3>
                <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <h4 className="font-semibold">{selectedProduct.name}</h4>
                    <p className="text-abfrl-green font-bold">₹{selectedProduct.price}</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Size</label>
                  <select
                    value={checkoutData.size}
                    onChange={(e) => setCheckoutData({ ...checkoutData, size: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-abfrl-green"
                  >
                    {selectedProduct.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Payment Method</label>
                  <select
                    value={checkoutData.paymentMethod}
                    onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-abfrl-green"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                {checkoutData.paymentMethod === 'UPI' && (
                  <div>
                    <label className="block font-semibold mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={checkoutData.upiId}
                      onChange={(e) => setCheckoutData({ ...checkoutData, upiId: e.target.value })}
                      placeholder="yourname@upi"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-abfrl-green"
                    />
                  </div>
                )}

                {checkoutData.paymentMethod === 'Card' && (
                  <div>
                    <label className="block font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      value={checkoutData.cardNumber}
                      onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-abfrl-green"
                    />
                  </div>
                )}

                <button onClick={processOrder} className="btn-primary w-full">
                  Complete Purchase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmation */}
        {orderResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-abfrl-dark-green mb-4">Order Confirmed!</h3>
              <div className="space-y-2 mb-6">
                <p><strong>Order ID:</strong> {orderResult.orderId}</p>
                <p><strong>Product:</strong> {orderResult.product}</p>
                <p><strong>Size:</strong> {orderResult.size}</p>
                <p><strong>Discount Applied:</strong> ₹{orderResult.discount}</p>
                <p><strong>Final Amount:</strong> ₹{orderResult.amount}</p>
                <p className="text-sm text-gray-600 mt-4">{orderResult.fulfillment.message}</p>
              </div>
              <button
                onClick={() => {
                  setOrderResult(null);
                  setShowCheckout(false);
                  setSelectedProduct(null);
                }}
                className="btn-primary w-full"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-abfrl-dark-green mb-6">Our Products</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1">
                <div className="relative" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-abfrl-dark-green mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category} • {product.color}</p>
                  <p className="text-lg font-bold text-abfrl-green mb-3">₹{product.price}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.sizes.map(size => (
                      <span key={size} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {size}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTryOn(product)}
                      className="btn-secondary w-full text-sm"
                    >
                      👔 Try On
                    </button>
                    <button
                      onClick={() => handleCheckStock(product.id)}
                      className="btn-secondary w-full text-sm"
                    >
                      📦 Check Stock
                    </button>
                    <button
                      onClick={() => handleCheckout(product)}
                      className="btn-primary w-full text-sm"
                    >
                      🛒 Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCatalogPage;


