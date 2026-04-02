import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';

const stats = [
  { icon: '💬', label: 'Templates', value: '—', color: '#1a56db', path: '/templates' },
  { icon: '📋', label: 'Sequences', value: '—', color: '#7c3aed', path: '/sequences' },
  { icon: '👥', label: 'Contacts', value: '—', color: '#059669', path: '/contacts' },
  { icon: '📤', label: 'Messages Sent', value: '0', color: '#d97706', path: '#' },
];

const quickActions = [
  { icon: '➕', label: 'Create Template', desc: 'Design a new WhatsApp message template', path: '/templates/create' },
  { icon: '🚀', label: 'Create Sequence', desc: 'Set up a multi-step messaging campaign', path: '/sequences/create' },
  { icon: '🔗', label: 'WhatsApp Setup', desc: 'Connect your WhatsApp Business account', path: '/whatsapp' },
  { icon: '👤', label: 'Add Contact', desc: 'Import or add contacts to your hub', path: '/contacts' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="page-body">
          {/* Welcome header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>Welcome to Leadbug 🐞</h1>
            <p style={{ color: '#64748b', marginTop: 4 }}>Manage your WhatsApp CRM — templates, sequences, and contacts from one place.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {stats.map(s => (
              <div
                key={s.label}
                className="card"
                style={{ padding: '20px 24px', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onClick={() => s.path !== '#' && navigate(s.path)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 30 }}>{s.icon}</div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 12 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {quickActions.map(a => (
                <div
                  key={a.label}
                  style={{ display: 'flex', gap: 14, padding: '16px', border: '1.5px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', transition: 'border 0.15s, background 0.15s' }}
                  onClick={() => navigate(a.path)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a56db'; e.currentTarget.style.background = '#f0f7ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = ''; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp API Status banner */}
          <div className="card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg,#1a56db,#2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Connect WhatsApp Business API</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Start sending campaigns, reminders and replies directly from Leadbug.</div>
            </div>
            <button
              className="btn"
              style={{ background: '#fff', color: '#1a56db', borderRadius: '9999px', fontWeight: 700 }}
              onClick={() => navigate('/whatsapp')}
            >
              💬 Setup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
