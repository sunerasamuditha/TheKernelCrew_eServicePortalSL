import React from 'react';
import { useApp } from '../contexts/AppContext';

const Sidebar = () => {
  const { activeScreen, navTo, language, setLanguage } = useApp();

  const toggleMobileNav = () => {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    nav.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
    const icon = toggle.querySelector('.hamburger-icon');
    icon.textContent = nav.classList.contains('mobile-open') ? '✕' : '☰';
  };

  const navItems = [
    { id: 'home', icon: '■', label: 'Dashboard' },
    { id: 'smartscan', icon: '●', label: 'AI SmartScan' },
    { id: 'photoguard', icon: '●', label: 'AI PhotoGuard' },
    { id: 'documents', icon: '□', label: 'Documents' },
    { id: 'payments', icon: '▲', label: 'Payment & Booking' },
    { id: 'status', icon: '♦', label: 'Status & Queue' },
    { id: 'support', icon: '◆', label: 'Help & Support' },
    { id: 'profile', icon: '○', label: 'Profile' },
  ];
  
  const handleSetLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="emblem">eP</div>
        <div className="logo-text">
          <h1>e-Passport SL</h1>
          <p>Digital Services</p>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem', margin: '1rem 0' }} className="desktop-lang-container">
          <div style={{height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', marginBottom: '1rem'}}></div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <span style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500}}>Language</span>
          </div>
          <div className="nav-language-selector" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '0.3rem', display: 'flex', gap: '0.2rem', backdropFilter: 'blur(10px)' }}>
              <button onClick={() => handleSetLanguage('en')} className={`nav-lang-btn ${language === 'en' ? 'active' : ''}`} data-lang="en" style={{ flex:1, padding:'0.4rem 0.6rem', border:'none', borderRadius:'6px', background: language === 'en' ? 'rgba(255, 255, 255, 0.9)' : 'transparent', color: language === 'en' ? '#005A70' : 'rgba(255,255,255,0.8)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', transition:'all 0.3s ease' }}>EN</button>
              <button onClick={() => handleSetLanguage('si')} className={`nav-lang-btn ${language === 'si' ? 'active' : ''}`} data-lang="si" style={{ flex:1, padding:'0.4rem 0.6rem', border:'none', borderRadius:'6px', background: language === 'si' ? 'rgba(255, 255, 255, 0.9)' : 'transparent', color: language === 'si' ? '#005A70' : 'rgba(255,255,255,0.8)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', transition:'all 0.3s ease' }}>සි</button>
              <button onClick={() => handleSetLanguage('ta')} className={`nav-lang-btn ${language === 'ta' ? 'active' : ''}`} data-lang="ta" style={{ flex:1, padding:'0.4rem 0.6rem', border:'none', borderRadius:'6px', background: language === 'ta' ? 'rgba(255, 255, 255, 0.9)' : 'transparent', color: language === 'ta' ? '#005A70' : 'rgba(255,255,255,0.8)', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', transition:'all 0.3s ease' }}>த</button>
          </div>
      </div>
      
      <div className="mobile-header-right">
        <div className="mobile-lang-selector">
            <button onClick={() => handleSetLanguage('en')} className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`} data-lang="en">EN</button>
            <button onClick={() => handleSetLanguage('si')} className={`mobile-lang-btn ${language === 'si' ? 'active' : ''}`} data-lang="si">සි</button>
            <button onClick={() => handleSetLanguage('ta')} className={`mobile-lang-btn ${language === 'ta' ? 'active' : ''}`} data-lang="ta">த</button>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileNav}>
            <span className="hamburger-icon">☰</span>
        </button>
      </div>

      <nav className="nav" role="navigation" aria-label="Main">
        {navItems.map(item => (
          <button
            key={item.id}
            className={activeScreen === item.id ? 'active' : ''}
            onClick={() => navTo(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
