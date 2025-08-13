import React from 'react';

const Footer = () => {
    return (
        <footer className="footer" style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--card-border)',
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '0.85rem'
        }}>
            Prototype UI for e-Passport SL — not connected to real back-end
        </footer>
    );
};

export default Footer;
