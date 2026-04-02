const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  businessEmail: { type: String, required: true },
  countryCode: { type: String, default: '+91' },
  whatsappNumber: { type: String, required: true },
  companyName: { type: String, required: true },
  numberOfEmployees: { type: String },
  annualRevenue: { type: String },
  industry: { type: String },
  subCategory: { type: String },
  objectives: [{ type: String }],
  otp: { type: String },
  otpExpiry: { type: Date },
  isNumberVerified: { type: Boolean, default: false },
  metaVerificationStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Failed'],
    default: 'Pending',
  },
  wabaId: { type: String },
  displayName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Onboarding', onboardingSchema);
