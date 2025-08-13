import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState('home');
  const [language, setLanguage] = useState('en'); // 'en', 'si', 'ta'

  const screenData = {
    home: { title: 'Dashboard', subtitle: 'Welcome to your e-Passport digital services portal' },
    smartscan: { title: 'AI SmartScan', subtitle: 'Capture your NIC and let AI extract the information' },
    photoguard: { title: 'AI PhotoGuard', subtitle: 'Get ICAO-compliant passport photos on the first try' },
    documents: { title: 'Documents', subtitle: 'Upload and manage your supporting documents' },
    payments: { title: 'Payment & Booking', subtitle: 'Secure payment and AI-guided appointment booking' },
    status: { title: 'Status & Queue', subtitle: 'Track your application and live queue updates' },
    support: { title: 'Help & Support', subtitle: 'Get instant help from our AI assistant' },
    profile: { title: 'Profile & Settings', subtitle: 'Manage your account and preferences' },
  };

  const navTo = (screenId) => {
    setActiveScreen(screenId);
    if (window.innerWidth <= 768) {
      const nav = document.querySelector('.nav');
      const toggle = document.querySelector('.mobile-menu-toggle');
      if (nav && toggle && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        toggle.classList.remove('active');
        toggle.querySelector('.hamburger-icon').textContent = '☰';
      }
    }
  };

  const value = {
    activeScreen,
    navTo,
    screenData,
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
