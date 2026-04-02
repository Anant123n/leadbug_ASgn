import { useState, useEffect, useCallback } from 'react';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

const ContactHub = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', source: 'WhatsApp' });
  const { showToast, ToastContainer } = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      // Seed contacts for demo
      await api.seedContacts().catch(() => {});
      const res = await api.getContacts(search);
      setContacts(res.data);
    } catch {
      showToast('Failed to load contacts', 'error');
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === contacts.length ? [] : contacts.map(c => c._id));

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) return showToast('Name and phone required', 'error');
    try {
      await api.createContact(newContact);
      showToast('Contact added', 'success');
      setShowAdd(false);
      setNewContact({ name: '', phone: '', email: '', source: 'WhatsApp' });
      fetchContacts();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      showToast('Deleted', 'success');
      fetchContacts();
    } catch (e) { showToast(e.message, 'error'); }
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
              <div className="page-title">Contact Hub</div>
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Contact</button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div className="search-bar" style={{ flex: 1, maxWidth: 340 }}>
                <span className="search-bar-icon">🔍</span>
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search Contacts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-outline btn-sm">
                📤 Send Notifications
              </button>
              <button className="btn btn-ghost btn-sm">
                More Actions ▾
              </button>
            </div>

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div className="empty-state">
                  <span className="spinner" style={{ borderTopColor: '#1a56db', borderColor: '#e2e8f0', width: 32, height: 32 }} />
                </div>
              ) : contacts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-title">No contacts found</div>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>Add Contact</button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" className="checkbox" checked={selected.length === contacts.length && contacts.length > 0} onChange={toggleAll} /></th>
                      <th>Contact Name</th>
                      <th>Phone Number</th>
                      <th>Email Id</th>
                      <th>Created On</th>
                      <th>Source</th>
                      <th>Tags</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c._id}>
                        <td><input type="checkbox" className="checkbox" checked={selected.includes(c._id)} onChange={() => toggleSelect(c._id)} /></td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td style={{ color: '#64748b' }}>{c.email || '—'}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: 11 }}>{c.source || 'WhatsApp'}</span>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{c.tags?.join(', ') || '-'}</td>
                        <td>
                          <button className="icon-btn danger" onClick={() => handleDelete(c._id)} title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {contacts.length > 0 && (
              <div className="pagination">
                <span>20 per page</span>
                <div className="pagination-btns">
                  <button className="pagination-btn" disabled>⟪ First</button>
                  <button className="pagination-btn" disabled>‹ Previous</button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">Next ›</button>
                  <button className="pagination-btn">Last ⟫</button>
                </div>
                <span>Showing 1 to {contacts.length} of {contacts.length} results</span>
              </div>
            )}
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAdd && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>Add New Contact</h3>
                <button className="icon-btn" onClick={() => setShowAdd(false)} style={{ fontSize: 20 }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input className="form-input" placeholder="Full Name *" value={newContact.name} onChange={e => setNewContact(c => ({ ...c, name: e.target.value }))} />
                <input className="form-input" placeholder="Phone Number *" value={newContact.phone} onChange={e => setNewContact(c => ({ ...c, phone: e.target.value }))} />
                <input className="form-input" type="email" placeholder="Email" value={newContact.email} onChange={e => setNewContact(c => ({ ...c, email: e.target.value }))} />
                <select className="form-select" value={newContact.source} onChange={e => setNewContact(c => ({ ...c, source: e.target.value }))}>
                  <option>WhatsApp</option>
                  <option>Google Leads</option>
                  <option>Peoples Data</option>
                  <option>Manual</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddContact}>Add Contact</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactHub;
