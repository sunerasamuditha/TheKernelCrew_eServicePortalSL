const express = require('express');
const router = express.Router();

// Mock knowledge base articles
const knowledgeBase = [
  {
    id: 'kb001',
    title: 'Photo Guidelines',
    content: 'Complete guidelines for taking ICAO-compliant passport photos including lighting, background, and facial expression requirements.',
    category: 'photos',
    keywords: 'photo picture image guidelines requirements'
  },
  {
    id: 'kb002',
    title: 'Fee Structure',
    content: 'Detailed breakdown of all passport fees including standard processing (LKR 5,000), express (LKR 10,000), and urgent processing (LKR 15,000).',
    category: 'fees',
    keywords: 'fee cost price money payment charges'
  },
  {
    id: 'kb003',
    title: 'Processing Times',
    content: 'Standard processing takes 21 working days, express processing takes 10 working days, and urgent processing takes 5 working days.',
    category: 'processing',
    keywords: 'time duration processing days timeline'
  },
  {
    id: 'kb004',
    title: 'Required Documents',
    content: 'Birth certificate, NIC copy, guarantor form are required. Marriage certificate and address proof may be needed for certain cases.',
    category: 'documents',
    keywords: 'documents papers required birth certificate nic'
  }
];

// Search knowledge base
router.get('/search', (req, res) => {
  const { q, category } = req.query;
  
  let results = knowledgeBase;
  
  if (category) {
    results = results.filter(article => article.category === category);
  }
  
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.keywords.toLowerCase().includes(query)
    );
  }
  
  res.json({
    success: true,
    results,
    total: results.length
  });
});

// Get all articles
router.get('/articles', (req, res) => {
  res.json({
    success: true,
    articles: knowledgeBase
  });
});

// Submit support ticket
router.post('/ticket', (req, res) => {
  const { subject, message, priority, category } = req.body;
  
  const ticket = {
    id: `TICKET${Date.now()}`,
    subject,
    message,
    priority: priority || 'medium',
    category: category || 'general',
    status: 'open',
    createdAt: new Date().toISOString(),
    userId: 1 // Mock user ID
  };
  
  res.json({
    success: true,
    message: 'Support ticket created successfully',
    ticket
  });
});

// Chat with AI assistant
router.post('/chat', (req, res) => {
  const { message, language } = req.body;
  
  // Mock AI responses
  const responses = {
    en: [
      "I'm here to help with your passport application. What specific information do you need?",
      "For document requirements, you'll need a birth certificate, NIC copy, and guarantor form.",
      "Processing times vary: Standard (21 days), Express (10 days), Urgent (5 days).",
      "Photo requirements include neutral expression, plain background, and good lighting."
    ],
    si: [
      "ඔබගේ පාස්පෝර්ට් අයදුම්පත සඳහා මම උදව් කරමි. ඔබට කුමන තොරතුරු අවශ්‍යද?",
      "ලේඛන අවශ්‍යතා සඳහා, ඔබට උප්පැන්න සහතිකයක්, ජාතික හැඳුනුම්පත් පිටපතක් සහ ඇපකරු පෝරමයක් අවශ්‍ය වේ."
    ],
    ta: [
      "உங்கள் பாஸ்போர்ட் விண்ணப்பத்திற்கு நான் உதவ இங்கே இருக்கிறேன். உங்களுக்கு என்ன குறிப்பிட்ட தகவல் தேவை?",
      "ஆவண தேவைகளுக்கு, பிறப்பு சான்றிதழ், அடையாள அட்டை நகல் மற்றும் உத்தரவாத படிவம் தேவை."
    ]
  };
  
  const langResponses = responses[language] || responses.en;
  const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)];
  
  res.json({
    success: true,
    response: randomResponse,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
