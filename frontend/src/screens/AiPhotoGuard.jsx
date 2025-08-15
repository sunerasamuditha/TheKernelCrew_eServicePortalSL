import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';

const AiPhotoGuard = () => {
  const { navTo } = useApp();
  const [photoSrc, setPhotoSrc] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { startCamera, stopCamera, takePhoto } = useCamera(videoRef, canvasRef);

  const handleTakePhoto = () => {
    const photo = takePhoto();
    if (photo) {
      setPhotoSrc(photo);
      analyzePhoto();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoSrc(e.target.result);
        analyzePhoto();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePhoto = () => {
    setIsAnalyzing(true);
    setFeedback('Analyzing photo compliance...');
    
    setTimeout(() => {
      const isCompliant = Math.random() > 0.3; // Mock analysis
      if (isCompliant) {
        setFeedback('Photo is ICAO compliant! Good lighting, proper positioning, and neutral expression detected.');
      } else {
        setFeedback('Photo needs adjustment: Face is slightly tilted. Please retake with head straight and facing camera directly.');
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const retakePhoto = () => {
    setPhotoSrc(null);
    setFeedback('');
  };

  const confirmPhoto = () => {
    alert('Photo confirmed! Proceeding to document upload.');
    navTo('documents');
  };

  return (
    <section id="photoguard" className="content-section active">
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '350px' }}>
          <div className="camera-wrap">
            {!photoSrc ? (
              <>
                <video ref={videoRef} playsInline autoPlay muted></video>
                <div className="camera-overlay"></div>
              </>
            ) : (
              <img src={photoSrc} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
          
          <div className="controls">
            {!photoSrc ? (
              <>
                <button className="btn btn-secondary" onClick={startCamera}>Start Camera</button>
                <button className="btn btn-ghost" onClick={stopCamera}>Stop Camera</button>
                <button className="btn btn-primary" onClick={handleTakePhoto}>📸 Take Photo</button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>
                  Upload Photo
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={retakePhoto}>Retake</button>
                <button className="btn btn-primary" onClick={confirmPhoto} disabled={isAnalyzing}>
                  Confirm Photo
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ width: '400px', maxWidth: '100%' }}>
          <div className="card">
            <h3>AI PhotoGuard Analysis</h3>
            <div style={{ 
              minHeight: '120px', 
              padding: '1rem', 
              background: '#f8f9fa', 
              borderRadius: 'var(--border-radius)', 
              margin: '1rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isAnalyzing ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                  <div>Analyzing photo compliance...</div>
                </div>
              ) : feedback ? (
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{feedback}</div>
              ) : (
                <div style={{ color: 'var(--muted)', textAlign: 'center' }}>
                  Take or upload a photo to get AI-powered compliance analysis
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h4>Photo Requirements</h4>
              <ul style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--muted)', marginTop: '0.5rem' }}>
                <li>Face clearly visible and centered</li>
                <li>Neutral expression with eyes open</li>
                <li>Good lighting, no shadows</li>
                <li>Plain light background</li>
                <li>No glasses or head coverings</li>
                <li>Recent photo (within 6 months)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPhotoGuard;
