import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoMode from '../components/DemoMode';

const HomePage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-abfrl-light-gold">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-abfrl-green rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <h1 className="text-2xl font-bold text-abfrl-dark-green">Setu AI</h1>
            </div>
            <button
              onClick={() => setShowDemo(true)}
              className="btn-gold text-sm px-4 py-2"
            >
              🎬 Run Guided Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-abfrl-dark-green mb-4">
            Your Smart Retail Companion
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of shopping with AI-powered recommendations, 
            virtual try-on, and seamless checkout
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-abfrl-dark-green mb-3">
              AI Chat Assistant
            </h3>
            <p className="text-gray-600 mb-4">
              Get personalized product recommendations through natural conversation
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="btn-primary w-full"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2">
            <div className="text-5xl mb-4">👔</div>
            <h3 className="text-2xl font-bold text-abfrl-dark-green mb-3">
              Virtual Try-On
            </h3>
            <p className="text-gray-600 mb-4">
              See how clothes look on you before buying with our AI-powered try-on
            </p>
            <button
              onClick={() => navigate('/try-on')}
              className="btn-primary w-full"
            >
              Try It On
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-abfrl-dark-green mb-3">
              Product Catalog
            </h3>
            <p className="text-gray-600 mb-4">
              Browse our complete collection of premium fashion items
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="btn-primary w-full"
            >
              View Catalog
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-abfrl-dark-green mb-6 text-center">
            Powered by Intelligent Agents
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold text-abfrl-green">Recommendation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="font-semibold text-abfrl-green">Inventory</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <p className="font-semibold text-abfrl-green">Payment</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚚</div>
              <p className="font-semibold text-abfrl-green">Fulfillment</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <p className="font-semibold text-abfrl-green">Loyalty</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-abfrl-dark-green text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Setu AI - ABFRL</p>
          <p className="text-gray-300">Omnichannel Conversational Retail Assistant</p>
        </div>
      </footer>

      {/* Demo Mode Modal */}
      {showDemo && <DemoMode onClose={() => setShowDemo(false)} />}
    </div>
  );
};

export default HomePage;


