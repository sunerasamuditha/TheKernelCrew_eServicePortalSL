import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';

const AiSmartScan = () => {
  const { navTo } = useApp();
  const [formData, setFormData] = useState({ name: '', nic: '', dob: '', address: '' });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { startCamera, stopCamera } = useCamera(videoRef, canvasRef);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('field', '').toLowerCase()]: value }));
  };

  const doScan = () => {
    setFormData({
      name: 'Perera, Anura',
      nic: '901234567V',
      dob: '1990-12-05',
      address: 'No.7, Galle Road, Colombo',
    });
    alert('SmartScan completed (prototype). Please confirm the details.');
  };
  
  const handleFileChange = (event) => {
    if (event.target.files[0]) doScan();
  };

  const clearScan = () => setFormData({ name: '', nic: '', dob: '', address: '' });
  
  const confirmScan = () => {
      alert('Data confirmed. Proceeding to next steps.');
      navTo('photoguard');
  };

  return (
    <section id="smartscan" className="content-section active">
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="camera-wrap" id="cameraWrap">
            <video ref={videoRef} id="video" playsInline autoPlay muted></video>
            <canvas ref={canvasRef} id="captureCanvas" style={{ display: 'none' }}></canvas>
            <div className="camera-overlay"></div>
          </div>
          <div className="controls">
            <button className="btn btn-secondary" onClick={startCamera}>Use Camera</button>
            <button className="btn btn-ghost" onClick={stopCamera}>Stop</button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>Upload NIC</button>
            <button className="btn btn-ai-special" onClick={doScan}>AI Scan</button>
          </div>
        </div>
        <div style={{ width: '420px', maxWidth: '100%' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Extracted Data</h3>
            <div className="form-group mb-2">
              <label className="form-label">Full Name</label>
              <input id="fieldName" className="input" placeholder="Auto-filled after scan" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group mb-2">
              <label className="form-label">NIC Number</label>
              <input id="fieldNIC" className="input" placeholder="Auto-filled after scan" value={formData.nic} onChange={handleInputChange} />
            </div>
            <div className="form-grid mb-2">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input id="fieldDOB" className="input" placeholder="YYYY-MM-DD" value={formData.dob} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input id="fieldAddress" className="input" placeholder="Auto-filled address" value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={confirmScan}>Confirm & Continue</button>
              <button className="btn btn-ghost" onClick={clearScan}>🗑 Clear</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiSmartScan;
