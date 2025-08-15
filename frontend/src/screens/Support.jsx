import React, { useState } from 'react';

const KB_ARTICLES = [
  { id: 'photo-guide', title: 'Photo Guidelines', content: 'How to take compliant photos for your passport application.', keywords: 'photo picture image' },
  { id: 'fee-structure', title: 'Fee Structure', content: 'A complete breakdown of all charges, including standard and expedited services.', keywords: 'fee cost price money' },
  { id: 'processing-time', title: 'Processing Time', content: 'Information on the application timeline and how long it takes to receive your passport.', keywords: 'time long when process' },
  { id: 'office-locations', title: 'Office Locations', content: 'Find your nearest passport office, including addresses and hours of operation.', keywords: 'branch office location where' },
  { id: 'required-documents', title: 'Required Documents', content: 'A checklist of all documents needed for your application, such as birth certificate and NIC.', keywords: 'document paper form' }
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(KB_ARTICLES);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    if (!query) {
      setSearchResults(KB_ARTICLES);
    } else {
      setSearchResults(
        KB_ARTICLES.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query) ||
            article.keywords.toLowerCase().includes(query)
        )
      );
    }
  };

  return (
    <section id="support" className="content-section active">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--text)', fontWeight: 600 }}>Help & Support Center</h2>
        <div className="muted">Find answers, browse guides, and get emergency assistance</div>
      </div>
      <div className="support-container">
        <div className="help-resources-left">
          <div className="kb-search-card card">
            <h3>Knowledge Base</h3>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                id="kbSearch"
                type="text"
                placeholder="Search help articles..."
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem' }}
                value={searchTerm}
                onChange={handleSearch}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '1.25rem' }}>🔍</span>
            </div>
            <div id="kbResults" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {searchResults.length > 0 ? (
                searchResults.map(article => (
                  <div key={article.id} className="kb-article" style={{padding: '0.5rem', borderBottom: '1px solid #eee'}}>
                    <h4 style={{margin: '0 0 0.2rem 0'}}>{article.title}</h4>
                    <p style={{margin: 0}}>{article.content}</p>
                  </div>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          </div>
        </div>
        <div className="help-resources-right">
          <div className="chatbot-access-card card" style={{background: 'linear-gradient(135deg, rgba(0, 90, 112, 0.1), rgba(0, 90, 112, 0.05))'}}>
             <h3>AI Assistant</h3>
             <p>Get instant answers with our multilingual AI chatbot. Available 24/7.</p>
             <button className="btn btn-primary" style={{width: '100%'}} onClick={() => document.getElementById('chatbotToggle')?.click()}>💬 Start Chatting</button>
          </div>
           <div className="emergency-contact-card card" style={{background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(255, 193, 7, 0.1))'}}>
             <h3>Emergency Help</h3>
             <p>Need urgent assistance? Our emergency hotline is available 24/7 for critical issues.</p>
             <button className="btn btn-danger" style={{width: '100%'}} onClick={() => alert('Call Emergency Hotline: 1919')}>📞 Call Hotline: 1919</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
