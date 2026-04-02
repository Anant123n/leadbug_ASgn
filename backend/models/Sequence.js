const mongoose = require('mongoose');

const sequenceTemplateStepSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  templateName: { type: String },
  day: { type: Number, default: 1 },
  sendTime: { type: String, default: '09:00' },
  isActive: { type: Boolean, default: true },
});

const recipientSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
});

const sequenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['One Time', 'Ongoing'], default: 'One Time' },
  fromNumber: { type: String },
  activateRetries: { type: Boolean, default: false },
  templateSteps: [sequenceTemplateStepSchema],
  recipientMode: { type: String, enum: ['contact_list', 'manual'], default: 'contact_list' },
  contactListIds: [{ type: String }],
  recipients: [recipientSchema],
  scheduleType: { type: String, enum: ['immediately', 'custom'], default: 'immediately' },
  scheduledAt: { type: Date },
  fallbackChannel: { type: String, enum: ['Email', 'WhatsApp', ''], default: '' },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Running', 'Completed', 'Pending', 'Failed'],
    default: 'Draft',
  },
  isActive: { type: Boolean, default: true },
  category: { type: String, default: 'Marketing' },
  channel: { type: String, default: 'WhatsApp' },
  createdBy: { type: String, default: 'Admin' },
  stats: {
    attempted: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sequence', sequenceSchema);
