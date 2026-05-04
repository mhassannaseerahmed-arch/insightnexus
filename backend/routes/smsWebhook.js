const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');

/**
 * Twilio SMS Webhook
 * Handle incoming replies from patients (e.g., "YES" to confirm)
 */
router.post('/webhook', async (req, res) => {
  const { Body, From } = req.body;
  const twiml = new twilio.twiml.MessagingResponse();

  try {
    if (!Body || !From) {
      console.log('❌ Missing Body or From in webhook request');
      return res.status(400).send('Missing parameters');
    }

    const incomingText = Body.trim().toUpperCase();
    
    // Find the most recent pending appointment for this phone number
    // We escape the phone number to handle the '+' character correctly
    const escapedFrom = From.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const appointment = await Appointment.findOne({ 
      patientPhone: { $regex: escapedFrom }, 
      status: { $in: ['pending', 'confirmed'] } 
    }).sort({ createdAt: -1 }).populate('clinic');

    if (!appointment) {
      console.log(`❌ No appointment found for number: ${From}`);
      twiml.message("Hi! We couldn't find an active appointment for this number. Please contact your clinic directly.");
      return res.type('text/xml').send(twiml.toString());
    }

    console.log(`✅ Found appointment for ${appointment.patientName}. Clinic: ${appointment.clinic?.clinicName || 'Unknown'}`);

    const clinicName = appointment.clinic?.clinicName || 'the clinic';

    if (incomingText === 'YES' || incomingText === 'CONFIRM') {
      appointment.status = 'confirmed';
      await appointment.save();
      twiml.message(`Thank you! Your appointment at ${clinicName} has been CONFIRMED. ✅`);
    } 
    else if (incomingText === 'NO' || incomingText === 'CANCEL') {
      appointment.status = 'cancelled';
      await appointment.save();
      twiml.message(`Understood. Your appointment at ${clinicName} has been CANCELLED. ❌`);
    } 
    else {
      twiml.message("Please reply with 'YES' to confirm or 'NO' to cancel your appointment.");
    }

    res.type('text/xml').send(twiml.toString());

  } catch (err) {
    console.error('Webhook Error:', err);
    twiml.message("Sorry, we encountered an error processing your request. Please call the clinic.");
    res.type('text/xml').send(twiml.toString());
  }
});

module.exports = router;
