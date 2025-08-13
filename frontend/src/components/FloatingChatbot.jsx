import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';

const FloatingChatbot = () => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatLogRef = useRef(null);

  const translations = {
    en: { welcome: "👋 Hello! I'm your ePassport Assistant. How can I help?", fees: 'Fees', documents: 'Documents', photo: 'Photo' },
    si: { welcome: "👋 ආයුබෝවන්! මම ඔබේ ඊ-පාස්පෝර්ට් සහායකයා.", fees: 'ගාස්තු', documents: 'ලේඛන', photo: 'ඡායාරූප' },
    ta: { welcome: "👋 வணக்கம்! நான் உங்கள் மின்-பாஸ்போர்ட் உதவியாளர்.", fees: 'கட்டணம்', documents: 'ஆவணங்கள்', photo: 'புகைப்படம்' }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: translations[language].welcome }]);
    }
  }, [isOpen, messages.length, language]);

  useEffect(() => {
    if(chatLogRef.current) {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    const newMessages = [...messages, { sender: 'user', text: inputValue }];
    setMessages(newMessages);
    const currentInput = inputValue;
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `This is a mock response to: "${currentInput}"` }]);
    }, 1000);
  };
  
  const quickAsk = (topic) => {
    const newMessages = [...messages, { sender: 'user', text: `Tell me about ${topic}` }];
    setMessages(newMessages);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `This is a mock response about ${topic}.` }]);
    }, 1000);
  };

  return (
    <div id="floatingChatbot" className="floating-chatbot">
      {isOpen && (
        <div id="chatbotWindow" className="chatbot-window">
          <div className="floating-chat-header">
            <div>ePassport Assistant</div>
            <div className="floating-language-selector">
                 <button onClick={() => setLanguage('en')} className={`floating-lang-btn ${language === 'en' ? 'active' : ''}`}>EN</button>
                 <button onClick={() => setLanguage('si')} className={`floating-lang-btn ${language === 'si' ? 'active' : ''}`}>සි</button>
                 <button onClick={() => setLanguage('ta')} className={`floating-lang-btn ${language === 'ta' ? 'active' : ''}`}>த</button>
            </div>
          </div>
          <div ref={chatLogRef} className="floating-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>{msg.text}</div>
            ))}
          </div>
          <div className="floating-chat-input-area">
             <div className="floating-quick-actions">
                <button className="floating-quick-chip" onClick={() => quickAsk('fees')}>💰 {translations[language].fees}</button>
                <button className="floating-quick-chip" onClick={() => quickAsk('documents')}>📄 {translations[language].documents}</button>
                <button className="floating-quick-chip" onClick={() => quickAsk('photo')}>📸 {translations[language].photo}</button>
             </div>
             <div className="chat-input-container">
                <input type="text" value={inputValue} className="chat-input" onChange={(e) => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type your question..." />
                <button onClick={handleSend} className="chat-send-btn">📤</button>
             </div>
          </div>
        </div>
      )}
      <div id="chatbotToggle" className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
      </div>
    </div>
  );
};

export default FloatingChatbot;
