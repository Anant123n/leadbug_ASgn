import { useNavigate, useLocation } from 'react-router-dom';

const navSections = [
  {
    label: 'Database',
    items: [
      { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
      { label: "People's Data", icon: '👥', path: '/contacts' },
      { label: 'Google Leads', icon: '📊', path: '/contacts' },
    ],
  },
  {
    label: 'Control Panel',
    items: [
      { label: 'Email CRM', icon: '📧', path: '#', arrow: true },
      { label: 'Media Connect', icon: '🔗', path: '#', arrow: true },
    ],
  },
  {
    label: 'Account Settings',
    items: [
      { label: 'Account Settings', icon: '⚙️', path: '#', arrow: true },
      { label: 'All Publishers Sites', icon: '🌐', path: '#', arrow: true },
      { label: 'SEO', icon: '🔍', path: '#' },
      { label: 'WhatsApp API', icon: '💬', path: '/whatsapp', arrow: true },
      { label: 'Shop', icon: '🛒', path: '#' },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: 28 }}>🐞</span>
        <span className="sidebar-logo-text">LeadBug OMT</span>
      </div>

      <input className="sidebar-search" placeholder="Search" />

      <nav style={{ flex: 1 }}>
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            <ul className="sidebar-nav">
              {section.items.map((item) => (
                <li key={item.label} className="sidebar-nav-item">
                  <button
                    className={`sidebar-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => item.path !== '#' && navigate(item.path)}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {item.label}
                    {item.arrow && <span className="arrow">›</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <button
          className="sidebar-nav-link"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onClick={() => navigate('/onboarding')}
        >
          <span className="sidebar-icon">🚪</span>
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
