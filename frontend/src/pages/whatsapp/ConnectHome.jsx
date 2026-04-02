import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';

const ConnectHome = () => {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 52px)' }}>
          <div className="connect-home-card">
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>Connect WhatsApp Business API</h2>
            <p style={{ color: '#64748b', marginTop: 12, lineHeight: 1.6, maxWidth: 440, margin: '12px auto 0' }}>
              Connect your business WhatsApp number to send campaigns,
              reminders and replies directly from Leadbug.
            </p>
            <div className="connect-whatsapp-icon">💬</div>
            <button
              className="btn btn-primary btn-lg"
              style={{ borderRadius: '9999px', padding: '14px 32px', fontSize: 16 }}
              onClick={() => navigate('/onboarding')}
            >
              <span>💬</span> Start WhatsApp Setup
            </button>
            <p style={{ marginTop: 32, fontSize: 13, color: '#94a3b8' }}>
              Powered by Leadbug &amp; Meta WhatsApp Business Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectHome;
