import { useNavigate, useLocation } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tutorial', path: '#' },
    { label: 'Help', path: '#' },
    { label: 'Billing & Payments', path: '#' },
  ];

  return (
    <nav className="topnav">
      <div className="topnav-links">
        {links.map((l) => (
          <button
            key={l.label}
            className={`topnav-link ${location.pathname === l.path ? 'active' : ''}`}
            onClick={() => l.path !== '#' && navigate(l.path)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="topnav-right">
        <span className="topnav-credits">Available Credits: 0</span>
        <button className="topnav-btn" onClick={() => navigate('/dashboard')}>My Profile</button>
        <span className="topnav-link" style={{ cursor: 'default' }}>Refer and Earn</span>
        <button className="topnav-bell" title="Notifications">🔔</button>
      </div>
    </nav>
  );
};

export default TopNav;
