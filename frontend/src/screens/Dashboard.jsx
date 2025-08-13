import React from 'react';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { navTo } = useApp();

  return (
    <section id="home" className="card" style={{gridColumn: '1 / -1', display: 'block'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2>Ayubowan, Anura</h2>
          <div className="muted">Your application summary and quick actions</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="muted">Application Status</div>
            <div style={{ fontWeight: 900, color: 'var(--peacock)' }}>Biometrics Pending</div>
          </div>
          <button className="cta btn-new-application" onClick={() => navTo('smartscan')}>
            Start New Application
          </button>
        </div>
      </div>

      <div style={{ marginTop: '18px' }} className="grid grid-2">
        <div className="card">
          <h2>Application Status</h2>
          <div className="muted">At a glance timeline</div>
          <div style={{ marginTop: '12px' }} className="stepper" id="statusStepper">
            <div className="step active" data-step="1">Submitted</div>
            <div className="step" data-step="2">Biometrics</div>
            <div className="step" data-step="3">In Review</div>
            <div className="step" data-step="4">Printed</div>
            <div className="step" data-step="5">Ready</div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <button className="ghost btn-tracker" onClick={() => navTo('status')}>
              View full tracker
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="cta btn-ai-special" onClick={() => navTo('smartscan')}>AI SmartScan</button>
              <button className="cta btn-ai-special" style={{ background: 'var(--gold)', color: 'var(--text)' }} onClick={() => navTo('photoguard')}>PhotoGuard</button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="ghost btn-quick-action" onClick={() => navTo('documents')}>Upload Documents</button>
              <button className="ghost btn-quick-action" onClick={() => navTo('payments')}>Book Appointment</button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="ghost btn-quick-action" onClick={() => navTo('support')}>HelpBot</button>
              <button className="ghost btn-quick-action" onClick={() => navTo('profile')}>Profile</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <div className="muted" style={{ marginTop: '8px' }}>
            You uploaded a new document — Birth Certificate (Verified)
          </div>
          <div className="muted" style={{ marginTop: '6px' }}>
            Appointment booked: Colombo - 16 Aug 2025, 09:30 (Low wait)
          </div>
        </div>

        <div className="card">
          <h2>Notifications</h2>
          <div className="muted" style={{ marginTop: '8px' }}>
            No urgent notifications. All good.
          </div>
          <div style={{ marginTop: '10px' }}>
            <button className="cta btn-tracker" onClick={() => navTo('status')}>
              Track Application
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
