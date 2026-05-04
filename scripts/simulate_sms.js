const path = require('path');
// Add backend node_modules to the search path
module.paths.push(path.join(__dirname, '../backend/node_modules'));

const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const Appointment = require('../backend/models/Appointment');

async function simulateSmsReply(replyText = 'YES') {
  try {
    // 1. Connect to DB to find the latest patient phone number
    await mongoose.connect(process.env.MONGODB_URI);
    
    const latestAppt = await Appointment.findOne({ status: 'pending' }).sort({ createdAt: -1 });
    
    if (!latestAppt) {
      console.log('❌ No pending appointments found to simulate a reply for.');
      process.exit(1);
    }

    console.log(`🔍 Found pending appointment for: ${latestAppt.patientName} (${latestAppt.patientPhone})`);
    console.log(`🚀 Simulating SMS reply: "${replyText}"...`);

    // 2. Prepare the mock webhook request
    const postData = `Body=${encodeURIComponent(replyText)}&From=${encodeURIComponent(latestAppt.patientPhone)}`;

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/sms/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✅ Webhook successful!');
        console.log('💬 Twilio Response:', data);
        mongoose.connection.close();
      });
    });

    req.on('error', (err) => {
      console.error('❌ Simulation failed:', err.message);
      process.exit(1);
    });

    req.write(postData);
    req.end();

  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

// Get reply from command line or default to YES
const reply = process.argv[2] || 'YES';
simulateSmsReply(reply);
