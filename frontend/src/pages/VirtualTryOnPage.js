import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, virtualTryOn } from '../services/api';

const VirtualTryOnPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState('');

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

  const handleTryOn = async (product) => {
    if (!userImage) {
      alert('Please upload a clear front-facing photo to try on.');
      return;
    }
    setSelectedProduct(product);
    setIsLoading(true);
    setTryOnResult(null);

    try {
      const response = await virtualTryOn(product.id, null, userImage);
      setTimeout(() => {
        setTryOnResult(response.data);
        setIsLoading(false);
      }, 1500); // Simulate processing time
    } catch (error) {
      console.error('Error in virtual try-on:', error);
      setIsLoading(false);
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
              <h1 className="text-xl font-bold text-abfrl-dark-green">Virtual Try-On</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-abfrl-dark-green mb-2">
            Try Before You Buy
          </h2>
          <p className="text-gray-600">
            Upload your photo and select a product to see how it looks on you
          </p>
        </div>

        {/* Try-On Preview Section */}
        {selectedProduct && userImage && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Before</h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={userImage}
                    alt="Your Photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* After */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-abfrl-green">After</h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-abfrl-green mb-4"></div>
                        <p className="text-gray-600">Processing virtual try-on...</p>
                      </div>
                    </div>
                  ) : tryOnResult ? (
                    <div className="relative w-full h-full">
                      <img
                        src={userImage}
                        alt="Your Photo with Product"
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay product image (mock) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                      {selectedProduct.image && (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-3/4 h-auto opacity-80 mix-blend-multiply"
                          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                        />
                      )}
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded">
                        <p className="font-semibold">{tryOnResult.fit_rating}</p>
                        <p className="text-sm">{tryOnResult.recommendation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>Processing...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {tryOnResult && (
              <div className="mt-6 p-4 bg-abfrl-light-gold rounded-lg">
                <h4 className="font-semibold text-abfrl-dark-green mb-2">
                  {selectedProduct.name}
                </h4>
                <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-abfrl-green">₹{selectedProduct.price}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate('/catalog')}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate('/chat')}
                      className="btn-primary text-sm"
                    >
                      Chat with Setu AI
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Image Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-abfrl-dark-green mb-3">Upload your photo</h3>
          <p className="text-gray-600 mb-4">Use a clear, front-facing photo for the mock try-on.</p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setUserImage(reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            {userImage && (
              <div className="flex items-center space-x-3">
                <img src={userImage} alt="User" className="w-16 h-16 object-cover rounded-full border" />
                <span className="text-sm text-abfrl-green font-semibold">Photo ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Selection */}
        <div>
          <h3 className="text-2xl font-bold text-abfrl-dark-green mb-6">
            Select a Product to Try On
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleTryOn(product)}
              >
                <div className="relative" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct?.id === product.id && (
                    <div className="absolute inset-0 bg-abfrl-green bg-opacity-20 flex items-center justify-center">
                      <span className="bg-abfrl-green text-white px-4 py-2 rounded-full font-semibold">
                        Selected
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-abfrl-dark-green mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-abfrl-green">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-abfrl-dark-green mb-4">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">1️⃣</div>
              <p className="font-semibold">Upload Photo</p>
              <p className="text-sm text-gray-600">Upload a clear front-facing photo of yourself</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">2️⃣</div>
              <p className="font-semibold">Select Product</p>
              <p className="text-sm text-gray-600">Choose an item from our catalog</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">3️⃣</div>
              <p className="font-semibold">AI Processing</p>
              <p className="text-sm text-gray-600">Our AI overlays the product on your photo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">4️⃣</div>
              <p className="font-semibold">See Results</p>
              <p className="text-sm text-gray-600">View fit rating and recommendations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualTryOnPage;


