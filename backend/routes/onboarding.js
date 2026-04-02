const express = require('express');
const router = express.Router();
const { saveOnboarding, sendOtp, verifyOtp, verifyMeta, getStatus } = require('../controllers/onboardingController');

router.post('/', saveOnboarding);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/verify-meta', verifyMeta);
router.get('/status', getStatus);

module.exports = router;
