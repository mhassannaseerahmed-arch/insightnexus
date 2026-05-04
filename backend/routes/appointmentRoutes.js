// backend/routes/appointmentRoutes.js

const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')
const { sendSMS, buildReminderMessage, buildConfirmationMessage } = require('../services/smsService')
const auth = require('../middleware/auth')

// Use auth middleware for all routes
router.use(auth)

// POST - Book a new appointment
router.post('/book', async (req, res) => {
  try {
    const appointmentData = { ...req.body, clinic: req.clinicId }
    const appointment = new Appointment(appointmentData)
    await appointment.save()
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: appointment
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// GET - Get all appointments (filtered by clinic)
router.get('/all', async (req, res) => {
  try {
    const appointments = await Appointment.find({ clinic: req.clinicId })
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// GET - Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, clinic: req.clinicId })
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      })
    }
    res.status(200).json({
      success: true,
      data: appointment
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// PUT - Update appointment status
router.put('/:id/status', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinic: req.clinicId },
      { status: req.body.status },
      { new: true }
    )
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    // NEW: Send confirmation SMS if status is 'confirmed'
    if (req.body.status === 'confirmed') {
      try {
        const fullAppt = await Appointment.findById(appointment._id).populate('clinic');
        const body = buildConfirmationMessage(fullAppt, fullAppt.clinic?.smsTemplate);
        await sendSMS(appointment.patientPhone, body);
      } catch (smsError) {
        console.error('Failed to send confirmation SMS:', smsError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Status updated!',
      data: appointment
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// DELETE - Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, clinic: req.clinicId })
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled!'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// POST - Send manual SMS reminder
router.post('/:id/remind', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, clinic: req.clinicId })
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    const body = buildReminderMessage(appointment)
    await sendSMS(appointment.patientPhone, body)

    await Appointment.findByIdAndUpdate(appointment._id, {
      reminderSent: true,
      reminderSentAt: new Date(),
    })

    res.status(200).json({
      success: true,
      message: `SMS reminder sent to ${appointment.patientPhone}`,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
