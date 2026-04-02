import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

const STATUS_BADGE = {
  Completed: 'badge-success',
  Pending: 'badge-warning',
  Failed: 'badge-danger',
  Running: 'badge-primary',
  Scheduled: 'badge-primary',
  Draft: 'badge-gray',
};

const SequenceList = () => {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Sequences');
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const fetchSequences = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getSequences();
      setSequences(res.data);
    } catch {
      showToast('Failed to load sequences', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSequences(); }, [fetchSequences]);

  const handleToggle = async (seq) => {
    try {
      await api.updateSequence(seq._id, { isActive: !seq.isActive });
      setSequences(prev => prev.map(s => s._id === seq._id ? { ...s, isActive: !s.isActive } : s));
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sequence?')) return;
    try {
      await api.deleteSequence(id);
      showToast('Sequence deleted', 'success');
      fetchSequences();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const filtered = sequences.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

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
              <div className="page-title">WhatsApp Sequences</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Account Status: <span className="badge badge-success" style={{ marginLeft: 4 }}>Good</span>
                </div>
                <button style={{ fontSize: 13, color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Notifications Limit
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/sequences/create')}>
                  Create Sequence
                </button>
              </div>
            </div>

            {/* Search + Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
                <span className="search-bar-icon">🔍</span>
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search Sequence..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="tab-switcher">
                {['Templates', 'Sequences'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => { setActiveTab(tab); if (tab === 'Templates') navigate('/templates'); }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                <button className="icon-btn" onClick={fetchSequences} title="Refresh">🔄</button>
                <button className="icon-btn danger" title="Delete">🗑️</button>
                <button className="icon-btn" title="Edit">✏️</button>
                <button className="icon-btn" title="Filters">⚙️</button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
              {['Status', 'Category', 'Created by', 'Date Sent Live', 'Type'].map(f => (
                <button key={f} className="filter-select">
                  🚩 {f} ▾
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div className="empty-state">
                  <span className="spinner" style={{ borderTopColor: '#1a56db', borderColor: '#e2e8f0', width: 32, height: 32 }} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">No sequences yet</div>
                  <div className="empty-state-desc">Create your first WhatsApp sequence</div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/sequences/create')}>
                    Create Sequence
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ON/OFF</th>
                      <th>Sequence Name</th>
                      <th>Channel</th>
                      <th>Created By</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Attempted</th>
                      <th>Sent</th>
                      <th>Delivered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(seq => (
                      <tr key={seq._id}>
                        <td>
                          <label className="toggle">
                            <input type="checkbox" checked={seq.isActive} onChange={() => handleToggle(seq)} />
                            <span className="toggle-slider" />
                          </label>
                        </td>
                        <td style={{ fontWeight: 600 }}>{seq.name}</td>
                        <td>{seq.channel || 'WhatsApp'}</td>
                        <td>{seq.createdBy || 'Admin'}</td>
                        <td>{seq.category || 'Marketing'}</td>
                        <td><span className={`badge ${STATUS_BADGE[seq.status] || 'badge-gray'}`}>{seq.status}</span></td>
                        <td>{seq.stats?.attempted || 0}</td>
                        <td>{seq.stats?.sent ? `${seq.stats.sent}%` : '0%'}</td>
                        <td>{seq.stats?.delivered ? `${seq.stats.delivered}%` : '0%'}</td>
                        <td>
                          <button className="icon-btn danger" onClick={() => handleDelete(seq._id)} title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="pagination">
                <span>20 per page</span>
                <div className="pagination-btns">
                  <button className="pagination-btn" disabled>⟪ First</button>
                  <button className="pagination-btn" disabled>‹ Previous</button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">Next ›</button>
                  <button className="pagination-btn">Last ⟫</button>
                </div>
                <span>Showing 1 to {filtered.length} of {filtered.length} results</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceList;
