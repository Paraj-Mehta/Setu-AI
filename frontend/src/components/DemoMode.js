import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, checkInventory, processCheckout, applyLoyalty, processFulfillment } from '../services/api';

const DemoMode = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps = [
    {
      type: 'message',
      text: '👋 Welcome to Setu AI! I\'m your smart retail assistant.',
      delay: 1000,
    },
    {
      type: 'message',
      text: 'Let me help you find the perfect outfit. What are you looking for today?',
      delay: 1500,
    },
    {
      type: 'action',
      action: 'recommend',
      category: 'Shirts',
      delay: 2000,
    },
    {
      type: 'message',
      text: 'Great! I found some excellent options for you.',
      delay: 2000,
    },
    {
      type: 'action',
      action: 'inventory',
      productId: 1,
      delay: 2000,
    },
    {
      type: 'message',
      text: 'Perfect! The item is in stock. Would you like to try it on virtually?',
      delay: 2000,
    },
    {
      type: 'navigate',
      path: '/try-on',
      delay: 2000,
    },
    {
      type: 'message',
      text: 'The virtual try-on looks great! Ready to checkout?',
      delay: 3000,
    },
    {
      type: 'action',
      action: 'checkout',
      productId: 1,
      size: 'M',
      delay: 2000,
    },
    {
      type: 'action',
      action: 'loyalty',
      delay: 2000,
    },
    {
      type: 'action',
      action: 'fulfillment',
      delay: 2000,
    },
    {
      type: 'message',
      text: '🎉 Order confirmed! Your order will be delivered soon. Thank you for shopping with Setu AI!',
      delay: 2000,
    },
  ];

  useEffect(() => {
    if (isRunning && currentStep < demoSteps.length) {
      const step = demoSteps[currentStep];
      
      const timer = setTimeout(async () => {
        if (step.type === 'message') {
          setMessages(prev => [...prev, { type: 'bot', text: step.text }]);
          setCurrentStep(prev => prev + 1);
        } else if (step.type === 'action') {
          try {
            let result;
            switch (step.action) {
              case 'recommend':
                result = await getRecommendations(step.category);
                setMessages(prev => [...prev, {
                  type: 'bot',
                  text: `Found ${result.data.recommendations.length} recommendations!`,
                  data: result.data.recommendations
                }]);
                break;
              case 'inventory':
                result = await checkInventory(step.productId);
                setMessages(prev => [...prev, {
                  type: 'bot',
                  text: result.data.message
                }]);
                break;
              case 'checkout':
                result = await processCheckout(step.productId, step.size, 'UPI', null, null);
                setMessages(prev => [...prev, {
                  type: 'bot',
                  text: `✅ Payment successful! Order ID: ${result.data.order_id}`
                }]);
                break;
              case 'loyalty':
                result = await applyLoyalty('user_001', 2499);
                setMessages(prev => [...prev, {
                  type: 'bot',
                  text: result.data.message
                }]);
                break;
              case 'fulfillment':
                result = await processFulfillment('ORD123456', 'home_delivery', '123 Main St');
                setMessages(prev => [...prev, {
                  type: 'bot',
                  text: result.data.message
                }]);
                break;
            }
          } catch (error) {
            setMessages(prev => [...prev, {
              type: 'bot',
              text: 'An error occurred. Continuing demo...'
            }]);
          }
          setCurrentStep(prev => prev + 1);
        } else if (step.type === 'navigate') {
          navigate(step.path);
          setCurrentStep(prev => prev + 1);
        }
      }, step.delay);

      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep]);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setMessages([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-abfrl-green text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold">🎬 Guided Demo Mode</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {messages.length === 0 && !isRunning && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Watch the complete shopping journey!</p>
              <button onClick={startDemo} className="btn-primary">
                Start Demo
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  msg.type === 'bot' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-abfrl-green text-white'
                }`}>
                  <p>{msg.text}</p>
                  {msg.data && (
                    <div className="mt-2 text-sm">
                      {msg.data.slice(0, 2).map((item, i) => (
                        <div key={i} className="mt-1">• {item.name} - ₹{item.price}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {isRunning && (
            <div className="text-center mt-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-abfrl-green"></div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {!isRunning && messages.length > 0 && (
            <button onClick={startDemo} className="btn-primary">
              Restart Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoMode;


