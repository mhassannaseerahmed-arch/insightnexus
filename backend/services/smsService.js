// backend/services/smsService.js

const twilio = require('twilio')

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

/**
 * Normalize phone number to E.164 format for Pakistan (+92)
 * 03001234567 → +923001234567
 */
const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, '') // strip spaces/dashes
  if (digits.startsWith('92')) return `+${digits}`
  if (digits.startsWith('0'))  return `+92${digits.slice(1)}`
  return `+${digits}` // assume already international
}

/**
 * Send an SMS reminder to a patient
 */
const sendSMS = async (to, body) => {
  const normalized = normalizePhone(to)
  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to:   normalized,
    body,
  })
  console.log(`✅ SMS sent to ${normalized} — SID: ${message.sid}`)
  return message
}

/**
 * Build the appointment reminder message
 */
const buildReminderMessage = (appointment) => {
  const date = new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    `Hi ${appointment.patientName}! 👋\n\n` +
    `This is a reminder for your appointment tomorrow:\n` +
    `📅 Date: ${date}\n` +
    `⏰ Time: ${appointment.appointmentTime}\n` +
    (appointment.reason ? `📋 Reason: ${appointment.reason}\n\n` : '\n') +
    `Please reply YES to confirm or call us if you need to reschedule.\n\n` +
    `— AI Nexus Insight`
  )
}

/**
 * Build the appointment confirmation message
 */
const buildConfirmationMessage = (appointment, template = null) => {
  const dateStr = new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const clinicName = appointment.clinic?.clinicName || 'AI Nexus Insight';

  if (template) {
    return template
      .replace('{patientName}', appointment.patientName)
      .replace('{clinicName}',  clinicName)
      .replace('{date}',        dateStr)
      .replace('{time}',        appointment.appointmentTime);
  }

  return (
    `Hi ${appointment.patientName}! 👋\n\n` +
    `Great news! Your appointment has been CONFIRMED.\n` +
    `📅 Date: ${dateStr}\n` +
    `⏰ Time: ${appointment.appointmentTime}\n\n` +
    `We look forward to seeing you!\n\n` +
    `— ${clinicName}`
  );
}

module.exports = { sendSMS, buildReminderMessage, buildConfirmationMessage }
