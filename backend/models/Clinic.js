const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clinicSchema = new mongoose.Schema({
  clinicName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  businessHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' }
  },
  smsTemplate: {
    type: String,
    default: 'Hi {patientName}, your appointment at {clinicName} is confirmed for {date} at {time}. See you then!'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
clinicSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
clinicSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Clinic', clinicSchema);
