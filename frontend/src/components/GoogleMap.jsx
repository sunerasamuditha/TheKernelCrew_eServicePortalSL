import React, { useEffect, useRef } from 'react';

const GoogleMap = ({ center, zoom = 15, locations = [], style = {} }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    // Check if Google Maps API is available
    if (!window.google || !window.google.maps) {
      console.log('Google Maps API not loaded');
      return;
    }

    // Initialize map
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add markers for locations
      locations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: location.coordinates,
          map: mapInstanceRef.current,
          title: location.name,
          animation: window.google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #005A70;">${location.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">${location.address}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                <strong>Phone:</strong> ${location.phone}<br>
                <strong>Hours:</strong> ${location.hours}
              </p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });
      });
    }
  }, [center, zoom, locations]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '300px',
        ...style 
      }} 
    />
  );
};

export default GoogleMap;
