// backend/services/reminderJob.js
// Runs via Vercel Cron — finds appointments in the next 24 hours and sends SMS reminders

const Appointment = require('../models/Appointment')
const { sendSMS, buildReminderMessage } = require('./smsService')

const runReminders = async () => {
  console.log('⏰ Running serverless reminder job...')

  try {
    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000)

    // Find appointments in the 24-25hr window that haven't been reminded yet
    const upcoming = await Appointment.find({
      appointmentDate: { $gte: in24h, $lte: in25h },
      status: { $in: ['pending', 'confirmed'] },
      reminderSent: false,
    })

    console.log(`📋 Found ${upcoming.length} appointment(s) needing reminders`)
    let sentCount = 0;

    for (const appt of upcoming) {
      try {
        const body = buildReminderMessage(appt)
        await sendSMS(appt.patientPhone, body)

        // Mark as reminded
        await Appointment.findByIdAndUpdate(appt._id, {
          reminderSent: true,
          reminderSentAt: new Date(),
        })
        sentCount++;
      } catch (err) {
        console.error(`❌ Failed to send reminder to ${appt.patientPhone}:`, err.message)
      }
    }
    
    return { success: true, count: sentCount, totalFound: upcoming.length };
  } catch (err) {
    console.error('❌ Reminder job error:', err.message)
    throw err;
  }
}

module.exports = { runReminders }
