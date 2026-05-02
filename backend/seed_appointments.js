// backend/seed_appointments.js
require('dotenv').config();
const mongoose = require('mongoose');
const Clinic = require('./models/Clinic');
const Appointment = require('./models/Appointment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the latest clinic
    const clinic = await Clinic.findOne().sort({ createdAt: -1 });
    if (!clinic) {
      console.log('No clinic found to seed data for.');
      process.exit(1);
    }

    console.log(`Seeding data for clinic: ${clinic.clinicName} (${clinic.slug})`);

    const names = ['John Doe', 'Sarah Smith', 'Michael Chen', 'Emma Wilson', 'Ahmed Hassan', 'Olivia Taylor', 'James Bond', 'Grace Hopper', 'Steve Jobs', 'Bill Gates'];
    const reasons = ['Dental Checkup', 'Flu Symptoms', 'Consultation', 'Follow-up', 'Emergency Pain', 'Routine Cleaning', 'X-Ray', 'Skin Allergy'];
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const statuses = ['pending', 'confirmed', 'no-show', 'no-show', 'confirmed', 'pending']; // Weighted towards no-show for interesting analytics

    const appointments = [];
    const today = new Date();

    // Create 20 random appointments over the last 14 days and next 7 days
    for (let i = 0; i < 20; i++) {
      const dateOffset = Math.floor(Math.random() * 21) - 14; // -14 to +6 days
      const date = new Date();
      date.setDate(today.getDate() + dateOffset);

      appointments.push({
        patientName: names[Math.floor(Math.random() * names.length)],
        patientPhone: '+923' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
        appointmentDate: date,
        appointmentTime: times[Math.floor(Math.random() * times.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        clinic: clinic._id,
        reminderSent: Math.random() > 0.3,
      });
    }

    await Appointment.insertMany(appointments);
    console.log(`Successfully seeded 20 appointments for ${clinic.clinicName}!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
