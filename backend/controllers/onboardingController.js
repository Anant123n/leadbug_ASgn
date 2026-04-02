const Onboarding = require('../models/Onboarding');

// POST /api/onboarding — save business details (steps 1-3)
const saveOnboarding = async (req, res) => {
  try {
    const data = req.body;
    const onboarding = new Onboarding(data);
    await onboarding.save();
    res.status(201).json({ success: true, data: onboarding });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/onboarding/send-otp — generate a 6-digit OTP
const sendOtp = async (req, res) => {
  try {
    const { onboardingId } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await Onboarding.findByIdAndUpdate(onboardingId, { otp, otpExpiry });

    // In a real system we'd send via SMS; here we return it for dev/simulation
    res.json({ success: true, otp, message: 'OTP sent (simulated)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/onboarding/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { onboardingId, otp } = req.body;
    const record = await Onboarding.findById(onboardingId);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (new Date() > record.otpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    await Onboarding.findByIdAndUpdate(onboardingId, { isNumberVerified: true });
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/onboarding/verify-meta — simulate Meta verification
const verifyMeta = async (req, res) => {
  try {
    const { onboardingId } = req.body;
    // Simulate: 60% Approved, 25% Pending, 15% Failed
    const rand = Math.random();
    let status = 'Approved';
    if (rand > 0.6 && rand <= 0.85) status = 'Pending';
    else if (rand > 0.85) status = 'Failed';

    const wabaId = `${Math.floor(10000000000 + Math.random() * 90000000000)}`;
    const updates = { metaVerificationStatus: status };
    if (status === 'Approved') {
      updates.wabaId = wabaId;
    }

    const updated = await Onboarding.findByIdAndUpdate(onboardingId, updates, { new: true });
    res.json({ success: true, status, wabaId: updated.wabaId, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/onboarding/status — get latest onboarding record
const getStatus = async (req, res) => {
  try {
    const record = await Onboarding.findOne().sort({ createdAt: -1 });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { saveOnboarding, sendOtp, verifyOtp, verifyMeta, getStatus };
