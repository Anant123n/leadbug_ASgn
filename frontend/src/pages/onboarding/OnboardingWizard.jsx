import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../components/Toast';

/* ─── Step Illustrations (SVG placeholders as emoji art) ─── */
const illustrations = {
  1: (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>📋</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
        <span style={{ fontSize: 48 }}>🧑</span>
        <span style={{ fontSize: 48 }}>👩</span>
      </div>
    </div>
  ),
  2: (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 90 }}>👩‍💻</span>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        {['📘', '🐦', '📷', '🔗', '📌'].map((e, i) => (
          <span key={i} style={{ fontSize: 28 }}>{e}</span>
        ))}
      </div>
    </div>
  ),
  3: (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 90 }}>📈</span>
      <span style={{ fontSize: 60, marginLeft: -16 }}>🕴️</span>
    </div>
  ),
  4: (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 110 }}>💬</span>
    </div>
  ),
};

const INDUSTRIES = [
  'Marketing & Advertising', 'Retail', 'Education', 'Finance',
  'Entertainment, Social Media & Gaming', 'Healthcare', 'Technology',
  'Professional Services', 'Public Utilizes & Non-Profits', 'Automotive',
];

const OBJECTIVES = [
  { title: 'Generate High-intent Leads', sub: 'Click to WhatsApp Ads' },
  { title: 'Quality Ad Leads', sub: 'WhatsApp Forms' },
  { title: 'Re-target Qualified Leads in Bulk', sub: 'WhatsApp Bulk Campaigns' },
  { title: 'Automate Regular Follow-ups on Leads', sub: 'WhatsApp Automated Notification' },
  { title: 'Others Reasons', sub: 'If you wish to do Something Else' },
];

const EMP_OPTIONS = ['1–10', '11–50', '51–200', '201–500', '500+'];
const REVENUE_OPTIONS = ['< ₹10L', '₹10L – ₹1Cr', '₹1Cr – ₹10Cr', '₹10Cr – ₹100Cr', '₹100Cr+'];

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboardingId, setOnboardingId] = useState(null);
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  // Step 1
  const [form1, setForm1] = useState({
    fullName: '', businessEmail: '', countryCode: '+91',
    whatsappNumber: '', companyName: '', numberOfEmployees: '', annualRevenue: '',
  });

  // Step 2
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Step 3
  const [selectedObjectives, setSelectedObjectives] = useState([]);

  // Step 4
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const toggleObjective = (title) => {
    setSelectedObjectives((prev) =>
      prev.includes(title)
        ? prev.filter((o) => o !== title)
        : prev.length < 3 ? [...prev, title] : prev
    );
  };

  const handleStep1Continue = async () => {
    if (!form1.fullName || !form1.businessEmail || !form1.whatsappNumber || !form1.companyName) {
      return showToast('Please fill all required fields', 'error');
    }
    setLoading(true);
    try {
      const res = await api.saveOnboarding({ ...form1, industry: selectedIndustry, objectives: selectedObjectives });
      setOnboardingId(res.data._id);
      setStep(2);
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!onboardingId) return showToast('Please complete step 1 first', 'error');
    setLoading(true);
    try {
      const res = await api.sendOtp(onboardingId);
      setGeneratedOtp(res.otp);
      setOtpSent(true);
      showToast(`OTP sent (simulated): ${res.otp}`, 'info');
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showToast('Enter OTP', 'error');
    setLoading(true);
    try {
      await api.verifyOtp(onboardingId, otp);
      const metaRes = await api.verifyMeta(onboardingId);
      showToast(`Meta verification: ${metaRes.status}`, metaRes.status === 'Approved' ? 'success' : 'info');
      setTimeout(() => navigate('/whatsapp', { state: { status: metaRes.status, wabaId: metaRes.wabaId, onboardingId } }), 1000);
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="onboarding-layout">
      <ToastContainer />

      {/* LEFT */}
      <div className="onboarding-left">
        <div className="onboarding-logo">
          <span style={{ fontSize: 32 }}>🐞</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a56db', marginLeft: 8, letterSpacing: 1 }}>LEADBUG</span>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="onboarding-title">Business Details Capture</h1>
            <div className="onboarding-form">
              <input className="form-input" placeholder="Full Name" value={form1.fullName} onChange={e => setForm1({ ...form1, fullName: e.target.value })} />
              <input className="form-input" type="email" placeholder="Business Email" value={form1.businessEmail} onChange={e => setForm1({ ...form1, businessEmail: e.target.value })} />
              <div className="input-with-prefix">
                <div className="input-prefix">
                  <select value={form1.countryCode} onChange={e => setForm1({ ...form1, countryCode: e.target.value })}>
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                </div>
                <input className="input-prefix-inner" placeholder="WhatsApp Number" value={form1.whatsappNumber} onChange={e => setForm1({ ...form1, whatsappNumber: e.target.value })} />
              </div>
              <input className="form-input" placeholder="Company Name" value={form1.companyName} onChange={e => setForm1({ ...form1, companyName: e.target.value })} />
              <select className="form-select" value={form1.numberOfEmployees} onChange={e => setForm1({ ...form1, numberOfEmployees: e.target.value })}>
                <option value="">Number of Employees</option>
                {EMP_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <select className="form-select" value={form1.annualRevenue} onChange={e => setForm1({ ...form1, annualRevenue: e.target.value })}>
                <option value="">Annual Revenue</option>
                {REVENUE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="onboarding-actions">
              <button className="btn btn-outline btn-lg" onClick={handleStep1Continue} disabled={loading}>
                {loading ? <span className="spinner" style={{ borderTopColor: '#1a56db', borderColor: 'rgba(26,86,219,0.3)' }} /> : 'Continue'}
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="onboarding-title">Which Industry does your business belong to?</h1>
            <p className="onboarding-subtitle">We'll accordingly personalize your experiences</p>
            <div className="industry-pills">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  className={`industry-pill ${selectedIndustry === ind ? 'selected' : ''}`}
                  onClick={() => setSelectedIndustry(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
            <select className="form-select" value={subCategory} onChange={e => setSubCategory(e.target.value)}>
              <option value="">Sub - Category</option>
              <option>B2B</option><option>B2C</option><option>SaaS</option><option>D2C</option>
            </select>
            <div className="onboarding-actions">
              <button className="btn btn-outline btn-lg" onClick={() => setStep(3)}>Next</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h1 className="onboarding-title">What would you like to use Leadbug for?</h1>
            <p className="onboarding-subtitle">Choose upto 3 Objectives & we will help you achieve them super quick!</p>
            <div style={{ flex: 1 }}>
              {OBJECTIVES.map((obj) => (
                <div
                  key={obj.title}
                  className={`objective-option ${selectedObjectives.includes(obj.title) ? 'selected' : ''}`}
                  onClick={() => toggleObjective(obj.title)}
                >
                  <div>
                    <div className="objective-title">{obj.title}</div>
                    <div className="objective-subtitle">{obj.sub}</div>
                  </div>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedObjectives.includes(obj.title)}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
            <div className="onboarding-actions">
              <button className="btn btn-outline btn-lg" onClick={() => setStep(4)}>Next</button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h1 className="onboarding-title">Number Entry &amp; Validation</h1>
            <div className="onboarding-form">
              <div className="input-with-prefix">
                <div className="input-prefix">+91 ▾</div>
                <input className="input-prefix-inner" placeholder="WhatsApp Number" value={form1.whatsappNumber} readOnly />
              </div>
              <div style={{ position: 'relative' }}>
                <input className="form-input" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
                <button
                  onClick={handleSendOtp}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#1a56db', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
              {generatedOtp && (
                <div style={{ fontSize: 12, color: '#1a56db', background: '#e8f0fe', padding: '8px 12px', borderRadius: 8 }}>
                  🔐 <strong>Dev OTP (simulated):</strong> {generatedOtp}
                </div>
              )}
              <div className="otp-hints">
                <div className="otp-hint">
                  <span className="hint-icon info">ℹ️</span>
                  <span>Use a number that can receive SMS or call for OTP. Meta recommends a fresh number not already registered on WhatsApp</span>
                </div>
                <div className="otp-hint">
                  <span className="hint-icon success">✅</span>
                  <span>Use a number that can receive SMS or call for OTP. Meta recommends a fresh number not already registered on WhatsApp</span>
                </div>
                <div className="otp-hint">
                  <span className="hint-icon error">❌</span>
                  <span>Use a number that can receive SMS or call for OTP. Meta recommends a fresh number not already registered on WhatsApp</span>
                </div>
              </div>
            </div>
            <div className="onboarding-actions">
              <button className="btn btn-outline btn-lg" onClick={handleVerifyOtp} disabled={loading || !otpSent}>
                {loading ? <span className="spinner" style={{ borderTopColor: '#1a56db', borderColor: 'rgba(26,86,219,0.3)' }} /> : 'Check & Continue'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="onboarding-right">
        {illustrations[step]}
        <div className="onboarding-step-label">Step {step} of 4</div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
