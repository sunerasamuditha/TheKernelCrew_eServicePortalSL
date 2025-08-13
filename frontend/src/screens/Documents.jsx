import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Documents = () => {
  const { navTo } = useApp();
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Birth Certificate', status: 'verified', uploadDate: '2025-08-10', size: '2.1 MB' },
    { id: 2, name: 'NIC Copy', status: 'pending', uploadDate: '2025-08-12', size: '1.8 MB' },
  ]);
  const [dragOver, setDragOver] = useState(false);

  const documentTypes = [
    { id: 'birth-cert', name: 'Birth Certificate', required: true },
    { id: 'nic', name: 'National Identity Card', required: true },
    { id: 'guarantor-form', name: 'Guarantor Form', required: true },
    { id: 'address-proof', name: 'Address Proof', required: false },
    { id: 'marriage-cert', name: 'Marriage Certificate', required: false },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    files.forEach(file => {
      const newDoc = {
        id: documents.length + Math.random(),
        name: file.name,
        status: 'uploading',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      // Simulate upload process
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id ? { ...doc, status: 'verified' } : doc
          )
        );
      }, 2000);
    });
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return '✅';
      case 'pending': return '⏳';
      case 'uploading': return '📤';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'var(--success)';
      case 'pending': return 'var(--warning)';
      case 'uploading': return 'var(--info)';
      case 'error': return 'var(--error)';
      default: return 'var(--muted)';
    }
  };

  return (
    <section id="documents" className="content-section active">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div 
            className={`upload-area ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ marginBottom: '1.5rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <h3>Drag & Drop Documents</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              or click to browse your files
            </p>
            <input 
              type="file" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput" className="btn btn-primary">
              Choose Files
            </label>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Supported: PDF, JPG, PNG (Max 10MB each)
            </p>
          </div>

          <div className="card">
            <h3>Uploaded Documents</h3>
            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                No documents uploaded yet
              </div>
            ) : (
              <div style={{ marginTop: '1rem' }}>
                {documents.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{doc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                          {doc.size} • Uploaded {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: getStatusColor(doc.status),
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        {getStatusIcon(doc.status)} {doc.status}
                      </span>
                      <button 
                        onClick={() => removeDocument(doc.id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--error)', 
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Required Documents</h3>
            <div style={{ marginTop: '1rem' }}>
              {documentTypes.map(docType => {
                const uploaded = documents.find(doc => 
                  doc.name.toLowerCase().includes(docType.id.replace('-', ''))
                );
                return (
                  <div key={docType.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--card-border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{docType.name}</div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: docType.required ? 'var(--error)' : 'var(--muted)' 
                      }}>
                        {docType.required ? 'Required' : 'Optional'}
                      </div>
                    </div>
                    <div>
                      {uploaded ? '✅' : (docType.required ? '❗' : '⚪')}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => navTo('payments')}
                disabled={documentTypes.filter(d => d.required).some(d => 
                  !documents.find(doc => doc.name.toLowerCase().includes(d.id.replace('-', '')))
                )}
              >
                Continue to Payment
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <h4>Document Guidelines</h4>
            <ul style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--muted)' }}>
              <li>All documents must be clear and legible</li>
              <li>PDF format preferred for text documents</li>
              <li>Photos should be high resolution</li>
              <li>Ensure all information is visible</li>
              <li>Documents must be recent and valid</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documents;
