const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  clinicName: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['new', 'audit-sent', 'audit-generated-email-failed', 'contacted', 'closed'], default: 'new' },
  auditPath: { type: String },
  metadata: {
    appts: { type: Number },
    rate: { type: Number },
    avgRevenue: { type: Number },
    fillRate: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);
