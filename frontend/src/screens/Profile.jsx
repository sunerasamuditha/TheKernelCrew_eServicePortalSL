import React, { useState } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Anura Perera',
    mobile: '+94 77 123 4567',
    nic: '900123456V',
    email: 'anura@example.com'
  });
  const [saveStatus, setSaveStatus] = useState('Save Changes');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved!');
      setTimeout(() => {
        setSaveStatus('Save Changes');
      }, 2000);
    }, 1500);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
        alert('Logging out...');
    }
  };

  const handleDelete = () => {
    if (window.confirm('DANGER: This action is permanent and cannot be undone. Are you sure you want to delete your account?')) {
        const confirmText = prompt('Type "DELETE MY ACCOUNT" to confirm.');
        if (confirmText === 'DELETE MY ACCOUNT') {
            alert('Account deletion initiated.');
        } else {
            alert('Account deletion cancelled.');
        }
    }
  }

  return (
    <section id="profile" className="content-section active">
      <div className="section-header" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--peacock)' }}>Profile & Settings</h2>
        <div className="muted">Manage your account, preferences and download forms</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>Personal Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={profileData.fullName} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" name="mobile" value={profileData.mobile} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label>NIC Number</label>
              <input type="text" name="nic" value={profileData.nic} onChange={handleInputChange} className="form-input" disabled />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="form-input" />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saveStatus !== 'Save Changes'}>{saveStatus}</button>
            <button className="btn btn-secondary" onClick={() => alert('Password change requires SMS verification.')}>Change Password</button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>Preferences & Downloads</h3>
          <div className="form-group">
             <label>Interface Language</label>
             <select className="form-input">
                <option>English</option>
                <option>සිංහල (Sinhala)</option>
                <option>தமிழ் (Tamil)</option>
             </select>
          </div>
          <div style={{ borderTop: '1px solid #eee', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
            <h4>Application Forms</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-ghost" onClick={() => alert('Downloading Application_Form.pdf')}>Download Application Form</button>
              <button className="btn btn-ghost" onClick={() => alert('Downloading Guarantor_Form.pdf')}>Download Guarantor Form</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', borderColor: 'var(--error)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
                <h3 style={{color: 'var(--error)'}}>Account Management</h3>
                <p className="muted">Be careful with these actions.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
