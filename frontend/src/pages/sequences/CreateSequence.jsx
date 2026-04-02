import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/TopNav';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

/* ─── Step Header ─── */
const StepHeader = ({ current, onDraft }) => {
  const steps = ['Details', 'Template', 'Recipients', 'Schedule'];
  return (
    <div className="sequence-wizard-header">
      <h2 className="wizard-title">Create New WhatsApp Sequence</h2>
      <div className="wizard-steps">
        {steps.map((label, i) => {
          const n = i + 1;
          const isActive = n === current;
          const isDone = n < current;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`wizard-step ${isActive ? 'active' : isDone ? 'completed' : ''}`}>
                <div className="wizard-step-num">
                  {isDone ? '✓' : n}
                </div>
                {label}
              </div>
              {i < steps.length - 1 && <span className="wizard-step-arrow">›</span>}
            </div>
          );
        })}
      </div>
      <button className="btn btn-outline btn-sm" onClick={onDraft}>Save as Draft</button>
    </div>
  );
};

/* ─── Step 1: Details ─── */
const Step1 = ({ data, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <input
      className="form-input"
      placeholder="Sequence Name"
      value={data.name}
      onChange={e => onChange('name', e.target.value)}
      style={{ fontSize: 15 }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Select your Sequence type</div>
      <div className="radio-group">
        {[
          { val: 'One Time', icon: '📅', title: 'One Time Sequence', desc: 'Send a one-time broadcast notification to many customers at once.' },
          { val: 'Ongoing', icon: '🔁', title: 'Ongoing Sequence', desc: 'Set notification to be sent upon the occurrence of an external pre-defined trigger.' },
        ].map(opt => (
          <div
            key={opt.val}
            className={`type-card ${data.type === opt.val ? 'selected' : ''}`}
            onClick={() => onChange('type', opt.val)}
          >
            <div className={`type-card-icon ${data.type === opt.val ? '' : ''}`}>
              {opt.icon}
            </div>
            <div>
              <div className="type-card-title">{opt.title}</div>
              <div className="type-card-desc">{opt.desc}</div>
            </div>
            <input
              type="radio"
              name="type"
              checked={data.type === opt.val}
              onChange={() => onChange('type', opt.val)}
              style={{ accentColor: '#1a56db', marginLeft: 'auto' }}
            />
          </div>
        ))}
      </div>
    </div>
    <select
      className="form-select"
      value={data.fromNumber}
      onChange={e => onChange('fromNumber', e.target.value)}
    >
      <option value="">Select "From" WhatsApp Number ▾</option>
      <option value="+91 9876543210">+91 9876543210 (Verified)</option>
      <option value="+91 8888888888">+91 8888888888</option>
    </select>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 10 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Activate Retries</div>
        <div className="tooltip-banner" style={{ marginTop: 8 }}>
          <li>Retries don't add any extra cost to the sequence.</li>
          <li>Retries are done only for those messages which fail due to Meta's frequency capping.</li>
        </div>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={data.activateRetries} onChange={e => onChange('activateRetries', e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  </div>
);

/* ─── Step 2: Template ─── */
const Step2 = ({ steps, templates, onChoose, onUpdateStep, onRemoveStep }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>🕐</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>Select a message template from the library</span>
      </div>
      <button className="btn btn-outline btn-sm" onClick={onChoose}>Choose template</button>
    </div>
    {steps.length === 0 && (
      <div className="empty-state" style={{ padding: '30px' }}>
        <div style={{ fontSize: 32 }}>📋</div>
        <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 13 }}>No templates added yet. Click "Choose template" to add one.</div>
      </div>
    )}
    {steps.map((step, i) => (
      <div key={i} className="schedule-row">
        <span className="schedule-row-name">{step.templateName || `Template ${i + 1}`}</span>
        <div className="schedule-row-field">
          <label>Day</label>
          <input type="number" min="1" max="9999" value={step.day} onChange={e => onUpdateStep(i, 'day', +e.target.value)} />
        </div>
        <div className="schedule-row-field">
          <label>Send Time</label>
          <input type="time" value={step.sendTime} onChange={e => onUpdateStep(i, 'sendTime', e.target.value)} />
        </div>
        <span className="timezone-label">Your timezone: Asia/Calcutta</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: step.isActive ? '#1a56db' : '#94a3b8' }}>
            {step.isActive ? 'Active' : 'Inactive'}
          </span>
          <label className="toggle">
            <input type="checkbox" checked={step.isActive} onChange={e => onUpdateStep(i, 'isActive', e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <button className="icon-btn danger" onClick={() => onRemoveStep(i)}>🗑️</button>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Template Picker Modal ─── */
const TemplatePicker = ({ templates, onSelect, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 520, maxHeight: '70vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16 }}>Choose Template</h3>
        <button className="icon-btn" onClick={onClose} style={{ fontSize: 20 }}>×</button>
      </div>
      {templates.length === 0 ? (
        <div className="empty-state">
          <div>No templates available. <a href="/templates/create" style={{ color: '#1a56db' }}>Create one first.</a></div>
        </div>
      ) : (
        templates.map(t => (
          <div
            key={t._id}
            onClick={() => onSelect(t)}
            style={{ padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, marginBottom: 8, cursor: 'pointer', transition: 'border 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1a56db'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{t.body?.substring(0, 80)}...</div>
            <span className={`badge ${t.status === 'Approved' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: 6 }}>{t.status}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ─── Step 3: Recipients ─── */
const Step3 = ({ data, onChange, contactLists }) => (
  <div>
    <div className="radio-group" style={{ marginBottom: 20 }}>
      {[
        { val: 'contact_list', title: 'Contact List', desc: 'Send to an existing list of contacts' },
        { val: 'manual', title: 'Manual Entry', desc: 'Add recipients manually' },
      ].map(opt => (
        <div
          key={opt.val}
          className={`radio-option ${data.recipientMode === opt.val ? 'selected' : ''}`}
          onClick={() => onChange('recipientMode', opt.val)}
        >
          <input type="radio" checked={data.recipientMode === opt.val} onChange={() => onChange('recipientMode', opt.val)} style={{ accentColor: '#1a56db' }} />
          <div className="radio-option-content">
            <div className="radio-option-title">{opt.title}</div>
            <div className="radio-option-desc">{opt.desc}</div>
          </div>
        </div>
      ))}
    </div>

    {data.recipientMode === 'contact_list' && (
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Select Contact List <span style={{ color: '#dc2626' }}>*</span></div>
        <table className="data-table" style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" className="checkbox" /></th>
              <th>Name</th>
              <th>Contact</th>
              <th>Last Modified</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {contactLists.map((list, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={(data.contactListIds || []).includes(list.name)}
                    onChange={e => {
                      const prev = data.contactListIds || [];
                      onChange('contactListIds', e.target.checked ? [...prev, list.name] : prev.filter(x => x !== list.name));
                    }}
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{list.name}</td>
                <td>{list.count} Contacts</td>
                <td>{new Date(list.lastModified).toLocaleDateString()}</td>
                <td style={{ fontWeight: 700 }}>{list.source || 'WhatsApp'}</td>
              </tr>
            ))}
            {contactLists.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No contact lists yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {data.recipientMode === 'manual' && (
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Add Recipients Manually</div>
        {(data.recipients || []).map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input className="form-input" style={{ flex: 1 }} placeholder="Name" value={r.name} onChange={e => {
              const next = [...(data.recipients || [])];
              next[i] = { ...next[i], name: e.target.value };
              onChange('recipients', next);
            }} />
            <input className="form-input" style={{ flex: 1 }} placeholder="Phone (+91...)" value={r.phone} onChange={e => {
              const next = [...(data.recipients || [])];
              next[i] = { ...next[i], phone: e.target.value };
              onChange('recipients', next);
            }} />
            <button className="icon-btn danger" onClick={() => onChange('recipients', (data.recipients || []).filter((_, j) => j !== i))}>🗑️</button>
          </div>
        ))}
        <button className="btn btn-outline btn-sm" onClick={() => onChange('recipients', [...(data.recipients || []), { name: '', phone: '' }])}>
          + Add Recipient
        </button>
      </div>
    )}
  </div>
);

/* ─── Step 4: Schedule ─── */
const Step4 = ({ data, onChange }) => (
  <div>
    <div className="radio-group" style={{ marginBottom: 20 }}>
      {[
        { val: 'immediately', icon: '⚡', title: 'Immediately', desc: 'Sends the message right away without any delay' },
        { val: 'custom', icon: '📅', title: 'Custom date', desc: 'Allows you to schedule the message to be sent at a specific date and time.' },
      ].map(opt => (
        <div
          key={opt.val}
          className={`type-card ${data.scheduleType === opt.val ? 'selected' : ''}`}
          onClick={() => onChange('scheduleType', opt.val)}
        >
          <div className="type-card-icon">{opt.icon}</div>
          <div>
            <div className="type-card-title">{opt.title}</div>
            <div className="type-card-desc">{opt.desc}</div>
          </div>
          <input
            type="radio"
            checked={data.scheduleType === opt.val}
            onChange={() => onChange('scheduleType', opt.val)}
            style={{ accentColor: '#1a56db', marginLeft: 'auto' }}
          />
        </div>
      ))}
    </div>

    {data.scheduleType === 'custom' && (
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10 }}>
          <span>📅</span>
          <input type="date" style={{ border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: 13 }}
            value={data.scheduleDate || ''}
            onChange={e => onChange('scheduleDate', e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10 }}>
          <span>🕐</span>
          <input type="time" style={{ border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: 13 }}
            value={data.scheduleTime || ''}
            onChange={e => onChange('scheduleTime', e.target.value)}
          />
        </div>
      </div>
    )}

    <div style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Setup Fallback Channel</div>
      {['Email', 'WhatsApp'].map(ch => (
        <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14 }}>
          <input
            type="radio"
            name="fallback"
            checked={data.fallbackChannel === ch}
            onChange={() => onChange('fallbackChannel', ch)}
            style={{ accentColor: '#1a56db' }}
          />
          {ch}
        </label>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CreateSequence = () => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [allTemplates, setAllTemplates] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const [seqData, setSeqData] = useState({
    name: '',
    type: 'One Time',
    fromNumber: '',
    activateRetries: false,
    templateSteps: [],
    recipientMode: 'contact_list',
    contactListIds: [],
    recipients: [],
    scheduleType: 'immediately',
    scheduleDate: '',
    scheduleTime: '',
    fallbackChannel: '',
  });

  useEffect(() => {
    api.getTemplates().then(r => setAllTemplates(r.data)).catch(() => {});
    api.getContactLists().then(r => setContactLists(r.data)).catch(() => {});
  }, []);

  const setField = (key, val) => setSeqData(d => ({ ...d, [key]: val }));

  const addTemplateStep = (template) => {
    setSeqData(d => ({
      ...d,
      templateSteps: [...d.templateSteps, {
        templateId: template._id,
        templateName: template.name,
        day: 1,
        sendTime: '09:00',
        isActive: true,
      }],
    }));
    setShowPicker(false);
  };

  const updateTemplateStep = (i, key, val) => {
    setSeqData(d => {
      const steps = [...d.templateSteps];
      steps[i] = { ...steps[i], [key]: val };
      return { ...d, templateSteps: steps };
    });
  };

  const removeTemplateStep = (i) => {
    setSeqData(d => ({ ...d, templateSteps: d.templateSteps.filter((_, idx) => idx !== i) }));
  };

  const validateStep = () => {
    if (step === 1 && !seqData.name) { showToast('Sequence name is required', 'error'); return false; }
    if (step === 2 && seqData.templateSteps.length === 0) { showToast('Add at least one template', 'error'); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      let scheduledAt = null;
      if (seqData.scheduleType === 'custom' && seqData.scheduleDate && seqData.scheduleTime) {
        scheduledAt = new Date(`${seqData.scheduleDate}T${seqData.scheduleTime}`);
      }
      await api.createSequence({ ...seqData, scheduledAt });
      showToast('Sequence created & scheduled!', 'success');
      setTimeout(() => navigate('/sequences'), 1200);
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setSaving(false); }
  };

  const handleDraft = async () => {
    try {
      await api.createSequence({ ...seqData, status: 'Draft' });
      showToast('Saved as draft', 'success');
      setTimeout(() => navigate('/sequences'), 800);
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <ToastContainer />
        {showPicker && <TemplatePicker templates={allTemplates} onSelect={addTemplateStep} onClose={() => setShowPicker(false)} />}

        <div className="page-body" style={{ padding: 0 }}>
          <div style={{ background: '#fff', minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column' }}>
            <StepHeader current={step} onDraft={handleDraft} />

            <div style={{ display: 'flex', flex: 1 }}>
              {/* Left panel — decorative step panel */}
              <div className="wizard-left-panel" style={{ padding: 0, background: '#f8fafc' }} />

              {/* Right panel — form */}
              <div className="wizard-right-panel">
                {step === 1 && (
                  <Step1 data={seqData} onChange={setField} />
                )}
                {step === 2 && (
                  <Step2
                    steps={seqData.templateSteps}
                    templates={allTemplates}
                    onChoose={() => setShowPicker(true)}
                    onUpdateStep={updateTemplateStep}
                    onRemoveStep={removeTemplateStep}
                  />
                )}
                {step === 3 && (
                  <Step3 data={seqData} onChange={setField} contactLists={contactLists} />
                )}
                {step === 4 && (
                  <Step4 data={seqData} onChange={setField} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="wizard-footer">
              <button className="btn btn-outline" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/sequences')}>
                Cancel
              </button>
              {step < 4 ? (
                <button className="btn btn-primary btn-lg" onClick={handleNext}>
                  Save &amp; Continue
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={saving}>
                  {saving ? <><span className="spinner" /> Submitting...</> : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSequence;
