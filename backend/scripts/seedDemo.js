const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongoose   = require('mongoose')
const Appointment = require('../models/Appointment')
const Clinic      = require('../models/Clinic')

const patients = [
  { name: 'Ahmed Khan',      phone: '03001234567' },
  { name: 'Sara Malik',      phone: '03211234567' },
  { name: 'Bilal Hussain',   phone: '03331234567' },
  { name: 'Fatima Siddiqui', phone: '03451234567' },
  { name: 'Usman Tariq',     phone: '03121234567' },
  { name: 'Ayesha Raza',     phone: '03061234567' },
  { name: 'Hassan Ali',      phone: '03171234567' },
  { name: 'Nadia Akhtar',    phone: '03231234567' },
]

const reasons = ['Checkup', 'Teeth Cleaning', 'Root Canal', 'Consultation', 'Follow-up', 'X-Ray', 'Filling', 'Scaling']
const times   = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '17:00', '18:00']

const weightedStatuses = [
  'confirmed', 'confirmed', 'confirmed',
  'no-show',   'no-show',
  'completed', 'completed', 'completed',
  'pending',   'cancelled',
]

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const generateDate = (daysOffset) => {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(0, 0, 0, 0)
  return d
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find the latest created clinic
    const latestClinic = await Clinic.findOne().sort({ createdAt: -1 });
    if (!latestClinic) {
      console.log('❌ No clinics found. Please signup first!');
      process.exit(1);
    }

    console.log(`🏥 Seeding data for clinic: ${latestClinic.clinicName} (${latestClinic.email})`);

    // Clear existing appointments for THIS clinic
    await Appointment.deleteMany({ clinic: latestClinic._id })
    console.log('🗑️  Cleared existing appointments for this clinic')

    const appointments = []
    const addAppt = (baseData) => {
      appointments.push({ ...baseData, clinic: latestClinic._id });
    }

    // Past 30 days
    for (let i = -30; i < 0; i++) {
      const count = Math.floor(Math.random() * 3) + 1 
      for (let j = 0; j < count; j++) {
        const patient = randomFrom(patients)
        const status  = randomFrom(weightedStatuses)
        addAppt({
          patientName:     patient.name,
          patientPhone:    patient.phone,
          appointmentDate: generateDate(i),
          appointmentTime: randomFrom(times),
          reason:          randomFrom(reasons),
          status,
          reminderSent:    status !== 'pending',
          reminderSentAt:  status !== 'pending' ? new Date() : null,
        })
      }
    }

    // Next 7 days
    for (let i = 1; i <= 7; i++) {
      const count = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < count; j++) {
        const patient = randomFrom(patients)
        const status  = randomFrom(['pending', 'pending', 'confirmed'])
        addAppt({
          patientName:     patient.name,
          patientPhone:    patient.phone,
          appointmentDate: generateDate(i),
          appointmentTime: randomFrom(times),
          reason:          randomFrom(reasons),
          status,
          reminderSent:    status === 'confirmed',
          reminderSentAt:  status === 'confirmed' ? new Date() : null,
        })
      }
    }

    // Today
    for (let j = 0; j < 3; j++) {
      const patient = randomFrom(patients)
      addAppt({
        patientName:     patient.name,
        patientPhone:    patient.phone,
        appointmentDate: generateDate(0),
        appointmentTime: randomFrom(times),
        reason:          randomFrom(reasons),
        status:          randomFrom(['pending', 'confirmed', 'confirmed']),
        reminderSent:    true,
        reminderSentAt:  new Date(),
      })
    }

    await Appointment.insertMany(appointments)
    console.log(`✅ Seeded ${appointments.length} demo appointments for ${latestClinic.clinicName}`)
    console.log('🎬 Your dashboard is now demo-ready!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed();
