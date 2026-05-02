// backend/models/Waitlist.js

const mongoose = require('mongoose')

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  clinicType: {
    type: String,
    enum: ['dentist', 'physio', 'psychologist', 'other'],
    default: 'other',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

module.exports = mongoose.model('Waitlist', waitlistSchema)
