const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { generateAuditReport } = require('../services/auditGenerator');
const { sendAuditEmail } = require('../services/emailService');
const Lead = require('../models/Lead');

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const leadData = {
      name: 'Dr. Test Lead',
      email: 'test@clinic.com',
      clinicName: 'Test Clinic Alpha',
      phone: '+923001234567',
      appts: 25,
      rate: 18
    };

    console.log('📊 Generating Audit Report...');
    const auditFilePath = await generateAuditReport(leadData);

    console.log('📧 Sending Email...');
    const info = await sendAuditEmail(leadData, auditFilePath);

    console.log('✅ Test Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Failed:', err.message);
    process.exit(1);
  }
};

test();
