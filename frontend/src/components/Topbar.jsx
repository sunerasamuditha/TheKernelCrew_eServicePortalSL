import React from 'react';
import { useApp } from '../contexts/AppContext';

const Topbar = () => {
    const { activeScreen, screenData } = useApp();
    const { title, subtitle } = screenData[activeScreen] || { title: 'Dashboard', subtitle: 'Welcome' };

    return (
        <div className="topbar">
            <div className="welcome-section">
                <h2 id="pageTitle">{title}</h2>
                <p id="pageSubtitle">{subtitle}</p>
            </div>

            <div className="search-container">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search services, status, or help..." />
            </div>

            <div className="actions">
                <button className="notification-badge">3 Updates</button>
            </div>
        </div>
    );
};

export default Topbar;
