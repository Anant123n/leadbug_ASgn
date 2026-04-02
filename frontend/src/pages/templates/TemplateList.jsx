import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

const statusBadge = (status) => {
  const map = { Approved: 'badge-success', Pending: 'badge-warning', Rejected: 'badge-danger' };
  return map[status] || 'badge-gray';
};

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState('Templates');
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getTemplates(search);
      setTemplates(res.data);
    } catch (e) {
      showToast('Failed to load templates', 'error');
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.deleteTemplate(id);
      showToast('Template deleted', 'success');
      fetchTemplates();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === templates.length ? [] : templates.map(t => t._id));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <ToastContainer />
        <div className="page-body">
          <div className="card">
            {/* Header */}
            <div className="page-header">
              <div>
                <div className="page-title">WhatsApp Templates</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                  Account Status:
                  <span className="badge badge-success" style={{ marginLeft: 4 }}>Good</span>
                </div>
                <button style={{ fontSize: 13, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Notifications Limit
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/templates/create')}>
                  Create Templates
                </button>
              </div>
            </div>

            {/* Search + Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div className="search-bar" style={{ flex: 1, maxWidth: 340 }}>
                <span className="search-bar-icon">🔍</span>
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search templates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="tab-switcher">
                {['Templates', 'Sequences'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => { setActiveTab(tab); if (tab === 'Sequences') navigate('/sequences'); }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                <button className="icon-btn" title="Refresh" onClick={fetchTemplates}>🔄</button>
                <button className="icon-btn danger" title="Delete selected" onClick={() => selected.forEach(handleDelete)}>🗑️</button>
                <button className="icon-btn" title="Edit">✏️</button>
                <button className="icon-btn" title="Filters">⚙️</button>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div className="empty-state"><span className="spinner" style={{ borderTopColor: '#1a56db', borderColor: '#e2e8f0', width: 32, height: 32 }} /></div>
              ) : templates.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-title">No templates yet</div>
                  <div className="empty-state-desc">Create your first WhatsApp template</div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/templates/create')}>
                    Create Template
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" className="checkbox" checked={selected.length === templates.length && templates.length > 0} onChange={toggleAll} /></th>
                      <th>Title</th>
                      <th>Information</th>
                      <th>Sequence Name</th>
                      <th>Created By</th>
                      <th>Actions</th>
                      <th>Sent</th>
                      <th>Delivered</th>
                      <th>Clicked</th>
                      <th>Opened</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map(t => (
                      <tr key={t._id}>
                        <td><input type="checkbox" className="checkbox" checked={selected.includes(t._id)} onChange={() => toggleSelect(t._id)} /></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <span className={`badge ${statusBadge(t.status)}`} style={{ marginTop: 4, fontSize: 10 }}>{t.status}</span>
                        </td>
                        <td style={{ maxWidth: 200 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: '#64748b' }}>
                            {t.body?.substring(0, 60)}...
                          </div>
                        </td>
                        <td>{t.sequenceName || 'WhatsApp'}</td>
                        <td>{t.createdBy}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="icon-btn" title="Settings">⚙️</button>
                          </div>
                        </td>
                        <td>{t.stats?.sent || 0}%</td>
                        <td>{t.stats?.delivered || 0}%</td>
                        <td>{t.stats?.clicked || 0}%</td>
                        <td>{t.stats?.opened || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {templates.length > 0 && (
              <div className="pagination">
                <span>20 per page</span>
                <div className="pagination-btns">
                  <button className="pagination-btn" disabled>⟪ First</button>
                  <button className="pagination-btn" disabled>‹ Previous</button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">Next ›</button>
                  <button className="pagination-btn">Last ⟫</button>
                </div>
                <span>Showing 1 to {templates.length} of {templates.length} results</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateList;
