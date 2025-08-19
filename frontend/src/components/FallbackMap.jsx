import React from 'react';

const FallbackMap = ({ location }) => {
  const openInGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      position: 'relative',
      flexDirection: 'column',
      gap: '1rem',
      cursor: 'pointer'
    }} onClick={openInGoogleMaps}>
      <div style={{
        fontSize: '48px',
        background: 'white',
        color: 'var(--peacock)',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      }}>
        📍
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {location.name}
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
          {location.address}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
          Click to open in Google Maps
        </p>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '15px',
        right: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '0.8rem',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '20px'
        }}>
          Interactive Map
        </div>
      </div>
    </div>
  );
};

export default FallbackMap;
