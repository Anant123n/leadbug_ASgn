import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

const STATUS_COLORS = {
  Approved: 'success',
  Pending: 'warning',
  Failed: 'danger',
};

const IntegrationStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusOverride, setStatusOverride] = useState(location.state?.status || 'Approved');
  const [testPhone, setTestPhone] = useState('');
  const [wabaId] = useState(location.state?.wabaId || '10029387456102');
  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    api.getOnboardingStatus().then((r) => setOnboardingData(r.data)).catch(() => {});
  }, []);

  const displayName = onboardingData?.companyName || 'Acme Corp Ltd.';
  const phone = onboardingData ? `${onboardingData.countryCode} ${onboardingData.whatsappNumber}` : '+91 9876543210';

  const statusBadge = STATUS_COLORS[statusOverride] || 'warning';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="page-body">
          {/* Header */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="page-header">
              <div>
                <div className="page-title">WhatsApp Integration</div>
                <div className="page-subtitle">Manage your WhatsApp Business API Connection &amp; Setting</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline">Documentation</button>
                <button className="btn btn-primary">Sync Data</button>
              </div>
            </div>
          </div>

          {/* Dev Mode Toggle */}
          <div className="dev-mode-bar card" style={{ padding: '12px 20px' }}>
            <span>DEV MODE - TOGGLESTATE</span>
            {['Approved', 'Pending', 'Failed'].map((s) => (
              <button
                key={s}
                className={`badge badge-${STATUS_COLORS[s]}`}
                style={{ cursor: 'pointer', border: statusOverride === s ? '2px solid currentColor' : 'none' }}
                onClick={() => setStatusOverride(s)}
              >
                {s === 'Approved' ? 'Connected' : s}
              </button>
            ))}
          </div>

          {/* Main Status Card */}
          {statusOverride === 'Approved' && (
            <div className="integration-card card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>WhatsApp API Connected</h3>
                    <span className="badge badge-success">
                      <span className="status-dot green" style={{ marginRight: 5 }} /> Operational
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', maxWidth: 420 }}>
                    Your WhatsApp API is now live. You can start sending test messages and configuring flows. When the number is connected and live.
                  </p>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Contacted Number</label>
                      <div className="value">💬 {phone}</div>
                    </div>
                    <div className="info-item">
                      <label>Display Name (Meta Verified)</label>
                      <div className="value">{displayName}</div>
                    </div>
                    <div className="info-item">
                      <label>Verification Status</label>
                      <div className="value"><span style={{ color: '#16a34a' }}>✅ Verified</span></div>
                    </div>
                    <div className="info-item">
                      <label>WABA ID</label>
                      <div className="value">
                        {wabaId}
                        <button title="Copy" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                          onClick={() => navigator.clipboard.writeText(wabaId)}>📋</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ minWidth: 240 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right', marginBottom: 12 }}>
                    MESSAGING TIER<br />
                    <span style={{ fontSize: 14, color: '#1e293b', textTransform: 'none' }}>Tier 1 – 1K conversations/day</span>
                  </div>
                  <div className="quick-action-box">
                    <p style={{ fontWeight: 700, fontSize: 14 }}>Quick Actions</p>
                    <button className="btn btn-outline btn-sm w-full">View API Status</button>
                    <div className="input-with-prefix" style={{ marginTop: 6 }}>
                      <div className="input-prefix">+91 ▾</div>
                      <input className="input-prefix-inner" placeholder="Test phone..." value={testPhone} onChange={e => setTestPhone(e.target.value)} />
                    </div>
                    <button className="btn btn-primary w-full" style={{ marginTop: 4 }}>
                      💬 Send Test Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {statusOverride === 'Pending' && (
            <div className="integration-card card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>⏳</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Meta Verification Pending</h3>
              <p style={{ color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
                Your WhatsApp Business account is under review by Meta. This usually takes 1-2 business days. We'll notify you once approved.
              </p>
              <span className="badge badge-warning" style={{ marginTop: 16, fontSize: 13, padding: '8px 20px' }}>Pending Review</span>
            </div>
          )}

          {statusOverride === 'Failed' && (
            <div className="integration-card card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>❌</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Verification Failed</h3>
              <p style={{ color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
                Meta could not verify your WhatsApp Business account. Please check your details and try again.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
                <button className="btn btn-outline" onClick={() => navigate('/onboarding')}>Retry Setup</button>
                <button className="btn btn-primary">Contact Support</button>
              </div>
            </div>
          )}

          {/* Help Banner */}
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 12 }}>
            ❓ Need help?{' '}
            <span style={{ color: '#1a56db', cursor: 'pointer', fontWeight: 600 }}>
              Learn how WhatsApp campaigns work in Leadbug.
            </span>
          </p>

          {/* Next Steps */}
          {statusOverride === 'Approved' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div className="card" style={{ padding: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Next Steps</p>
                {[
                  { icon: '✏️', title: 'Create Message Templates', desc: 'WhatsApp requires pre-approved templates for outbound marketing' },
                  { icon: '📢', title: 'Launch a Campaign', desc: 'Send bulk messages to your contacts using approved templates' },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onClick={() => navigate('/templates')}
                  >
                    <div style={{ width: 36, height: 36, background: '#e8f0fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.desc}</div>
                    </div>
                    <span style={{ color: '#94a3b8' }}>›</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Activity Overview <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12 }}>Last 7 Days ▾</span></p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Messages Sent', value: 0, color: '#1a56db' },
                    { label: 'Delivered', value: 0, color: '#16a34a' },
                    { label: 'Read', value: 0, color: '#d97706' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>{stat.label}</span>
                      <span style={{ fontWeight: 700, fontSize: 16, color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatus;
