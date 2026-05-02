const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');

// Get clinic info by slug
router.get('/clinic/:slug', async (req, res) => {
  try {
    const clinic = await Clinic.findOne({ slug: req.params.slug }).select('-password');
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.json({ success: true, clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Book an appointment (Public)
router.post('/book', async (req, res) => {
  try {
    const { clinicId, patientName, patientPhone, patientEmail, appointmentDate, appointmentTime, reason } = req.body;

    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Clinic ID is required' });
    }

    const appointment = new Appointment({
      clinic: clinicId,
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending' // Default status for public bookings
    });

    await appointment.save();

    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
