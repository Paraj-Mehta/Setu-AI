import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithLLM } from '../services/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionData, setSessionData] = useState({
    selectedProducts: [],
    cart: [],
    userId: 'user_001',
  });

  // Load session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('setu_chat_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setMessages(parsed.messages || []);
      setSessionData(parsed.sessionData || sessionData);
    } else {
      addBotMessage('👋 Hello! I\'m Setu AI, your smart retail assistant. How can I help you today?');
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    localStorage.setItem('setu_chat_session', JSON.stringify({
      messages,
      sessionData,
    }));
  }, [messages, sessionData]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text, data = null, cta = null) => {
    setMessages(prev => [...prev, { type: 'bot', text, data, cta, timestamp: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const simulateTyping = (callback, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const processUserInput = async (userInput) => {
    if (!userInput.trim()) return;
    try {
      const historyText = messages.map(m => `${m.type}: ${m.text}`).join('\n');
      const llmRes = await chatWithLLM(userInput, historyText, sessionData.userId, true);
      const reply = llmRes?.data?.reply || "I'm here to help with products, stock, and try-ons! Tell me what you need.";
      simulateTyping(() => addBotMessage(reply, null, { label: 'Open catalog', path: '/catalog' }), 600);
    } catch (error) {
      addBotMessage("I'm having trouble reaching the assistant. Please try again.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addUserMessage(userMessage);
    setInput('');
    await processUserInput(userMessage);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="text-abfrl-green hover:text-abfrl-dark-green">
                ← Back
              </button>
              <div className="w-10 h-10 bg-abfrl-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="text-xl font-bold text-abfrl-dark-green">Setu AI Chat</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('setu_chat_session');
                setMessages([]);
                addBotMessage('👋 Hello! I\'m Setu AI. How can I help you today?');
              }}
              className="text-sm text-gray-600 hover:text-abfrl-green"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] rounded-lg p-4 shadow ${
                msg.type === 'bot' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-abfrl-green text-white'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.data && Array.isArray(msg.data) && (
                  <div className="mt-3 space-y-2">
                    {msg.data.map((item, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded border">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.category} • {item.color}</p>
                            <p className="text-abfrl-green font-bold">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => navigate('/catalog')}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {msg.cta && (
                  <div className="mt-3">
                    <button
                      onClick={() => navigate(msg.cta.path)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      {msg.cta.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-abfrl-green"
            />
            <button type="submit" className="btn-primary px-6">
              Send
            </button>
          </form>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setInput('Show me shirts')}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Shirts
            </button>
            <button
              onClick={() => setInput('Show me blazers')}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Blazers
            </button>
            <button
              onClick={() => setInput('Virtual try-on')}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Try-On
            </button>
            <button
              onClick={() => setInput('Check my loyalty points')}
              className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Loyalty
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;


