// backend/models/Appointment.js

const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  
  // Patient details
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: false
  },

  // Appointment details
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: false
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },

  // Reminder tracking
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: {
    type: Date,
    default: null
  },
  // Clinic reference
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },

}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema)
