import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/try-on" element={<VirtualTryOnPage />} />
          <Route path="/catalog" element={<ProductCatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


