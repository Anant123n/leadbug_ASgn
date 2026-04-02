const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
  type: { type: String, enum: ['QUICK_REPLY', 'URL', 'PHONE_NUMBER', 'COPY_CODE'], required: true },
  text: { type: String, required: true },
  value: { type: String }, // URL or phone number or code
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Marketing', 'Utility', 'Authentication'],
    required: true,
  },
  buttonType: { type: String },
  language: { type: String, default: 'English' },
  header: {
    type: { type: String, enum: ['None', 'Text', 'Image', 'Video', 'Document'], default: 'None' },
    text: { type: String },
  },
  body: { type: String, required: true },
  footer: { type: String },
  buttons: [buttonSchema],
  variables: [{ type: String }], // e.g. ['{{1}}', '{{2}}']
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Pending',
  },
  createdBy: { type: String, default: 'Admin' },
  sequenceName: { type: String, default: 'WhatsApp' },
  stats: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Template', templateSchema);
