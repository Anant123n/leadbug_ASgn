import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

const CATEGORIES = ['Marketing', 'Utility', 'Authentication'];
const BUTTON_TYPES = ['None', 'Quick Replies', 'Copy Code, URL, Quick Replies etc', 'Call to Action'];
const HEADER_TYPES = ['None', 'Text', 'Image', 'Video', 'Document'];

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: '',
    buttonType: '',
    header: { type: 'None', text: '' },
    body: '',
    footer: '',
    buttons: [],
    language: 'English',
  });

  const [newButton, setNewButton] = useState({ type: 'QUICK_REPLY', text: '', value: '' });

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setHeader = (key, val) => setForm(f => ({ ...f, header: { ...f.header, [key]: val } }));

  const addVariable = () => {
    const varCount = (form.body.match(/\{\{\d+\}\}/g) || []).length + 1;
    setField('body', form.body + `{{${varCount}}}`);
  };

  const addButton = () => {
    if (!newButton.text) return;
    setForm(f => ({ ...f, buttons: [...f.buttons, { ...newButton }] }));
    setNewButton({ type: 'QUICK_REPLY', text: '', value: '' });
  };

  const removeButton = (i) => setForm(f => ({ ...f, buttons: f.buttons.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.name || !form.category || !form.body) {
      return showToast('Name, category, and body are required', 'error');
    }
    setSaving(true);
    try {
      await api.createTemplate(form);
      showToast('Template created!', 'success');
      setTimeout(() => navigate('/templates'), 1000);
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setSaving(false); }
  };

  /* ─── Live preview rendering ─── */
  const renderBodyPreview = (text) => {
    // Highlight variables in preview
    return text.replace(/\{\{([^}]+)\}\}/g, '<strong style="color:#1a56db">{{$1}}</strong>');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <ToastContainer />
        <div className="page-body" style={{ padding: '0' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>New Template</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => navigate('/templates')}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner" /> : 'Save'}
              </button>
            </div>
          </div>

          {/* Meta fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '16px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
            <input className="form-input" placeholder="Name" value={form.name} onChange={e => setField('name', e.target.value)} />
            <select className="form-select" value={form.category} onChange={e => setField('category', e.target.value)}>
              <option value="">Category ▾</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="form-select" value={form.buttonType} onChange={e => setField('buttonType', e.target.value)}>
              <option value="">Button Type (Optional) ▾</option>
              {BUTTON_TYPES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          {/* Language tab */}
          <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Template(s)</span>
            <button style={{ border: '1.5px dashed #1a56db', borderRadius: '9999px', padding: '5px 14px', fontSize: 13, color: '#1a56db', background: 'none', cursor: 'pointer', fontWeight: 600 }}>
              + {form.language} ▾
            </button>
          </div>

          {/* Split pane */}
          <div className="template-create-layout" style={{ borderRadius: 0, border: 'none', borderTop: '1px solid #e2e8f0' }}>
            {/* Preview Pane */}
            <div className="template-preview-pane">
              <div>
                <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>PREVIEW</div>
                <div className="wa-preview">
                  <div className="wa-bubble">
                    {form.header.type === 'Text' && form.header.text && (
                      <div className="wa-header-text">{form.header.text}</div>
                    )}
                    {form.header.type === 'Image' && (
                      <div style={{ background: '#e2e8f0', borderRadius: 8, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 28 }}>🖼️</div>
                    )}
                    {form.header.type === 'Video' && (
                      <div style={{ background: '#e2e8f0', borderRadius: 8, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 28 }}>🎬</div>
                    )}
                    {form.header.type === 'Document' && (
                      <div style={{ background: '#e2e8f0', borderRadius: 8, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 28 }}>📄</div>
                    )}
                    {form.body ? (
                      <div dangerouslySetInnerHTML={{ __html: renderBodyPreview(form.body) }} style={{ lineHeight: 1.6 }} />
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Message body will appear here...</span>
                    )}
                    {form.footer && <div className="wa-footer">{form.footer}</div>}
                    {form.buttons.length > 0 && (
                      <div className="wa-buttons">
                        {form.buttons.map((b, i) => (
                          <div key={i} className="wa-button-item">
                            {b.type === 'URL' ? '🔗' : b.type === 'PHONE_NUMBER' ? '📞' : '↩️'} {b.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Pane */}
            <div className="template-form-pane">
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Header <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Add a title, or select the media type you want to get approved for this template's header</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {HEADER_TYPES.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="headerType" value={type} checked={form.header.type === type} onChange={() => setHeader('type', type)} style={{ accentColor: '#1a56db' }} />
                      {type}
                    </label>
                  ))}
                </div>
                {form.header.type === 'Text' && (
                  <input
                    className="form-input"
                    style={{ marginTop: 10 }}
                    placeholder="Header text..."
                    value={form.header.text}
                    onChange={e => setHeader('text', e.target.value)}
                    maxLength={60}
                  />
                )}
              </div>

              {/* Body */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Body</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>The WhatsApp message in the language you have selected</div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="form-textarea"
                    placeholder="Typing..."
                    value={form.body}
                    onChange={e => setField('body', e.target.value)}
                    maxLength={1024}
                    style={{ minHeight: 120 }}
                  />
                  <span style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 11, color: '#94a3b8' }}>
                    {form.body.length}/1024
                  </span>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 8, borderRadius: 8 }}
                  onClick={addVariable}
                >
                  + Add variable
                </button>
              </div>

              {/* Footer */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Footer <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Add a short line of text to the bottom of your message template.</div>
                <input
                  className="form-input"
                  placeholder="e.g. Regards, Leadbug"
                  value={form.footer}
                  onChange={e => setField('footer', e.target.value)}
                  maxLength={60}
                />
              </div>

              {/* Buttons */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Buttons <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></div>
                {form.buttons.map((btn, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1a56db' }}>{btn.type}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{btn.text}</span>
                    {btn.value && <span style={{ fontSize: 12, color: '#64748b' }}>{btn.value}</span>}
                    <button className="icon-btn danger" onClick={() => removeButton(i)}>🗑️</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  <select className="form-select" style={{ width: 'auto', flex: '0 0 auto' }} value={newButton.type} onChange={e => setNewButton(b => ({ ...b, type: e.target.value }))}>
                    <option value="QUICK_REPLY">Quick Reply</option>
                    <option value="URL">URL</option>
                    <option value="PHONE_NUMBER">Phone Number</option>
                    <option value="COPY_CODE">Copy Code</option>
                  </select>
                  <input className="form-input" style={{ flex: 1 }} placeholder="Button text" value={newButton.text} onChange={e => setNewButton(b => ({ ...b, text: e.target.value }))} />
                  {(newButton.type === 'URL' || newButton.type === 'PHONE_NUMBER' || newButton.type === 'COPY_CODE') && (
                    <input className="form-input" style={{ flex: 1 }} placeholder={newButton.type === 'URL' ? 'https://...' : newButton.type === 'PHONE_NUMBER' ? '+91...' : 'code'} value={newButton.value} onChange={e => setNewButton(b => ({ ...b, value: e.target.value }))} />
                  )}
                  <button className="btn btn-outline btn-sm" onClick={addButton}>+ Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
