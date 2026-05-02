const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const appointmentRoutes = require('./routes/appointmentRoutes')
const waitlistRoutes    = require('./routes/waitlistRoutes')
const insightsRoutes    = require('./routes/insightsRoutes')
const authRoutes        = require('./routes/authRoutes')
const publicRoutes      = require('./routes/publicRoutes')
const { runReminders } = require('./services/reminderJob')

// Create express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.use('/api/appointments', appointmentRoutes)
app.use('/api/waitlist',     waitlistRoutes)
app.use('/api/insights',     insightsRoutes)
app.use('/api/auth',         authRoutes)
app.use('/api/public',       publicRoutes)

// Serverless Cron Endpoint for Vercel
app.get('/api/cron/reminders', async (req, res) => {
  try {
    const result = await runReminders();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!')
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message)
  })

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Nexus Insight API is running! 🚀' 
  })
})

// Start server locally (Vercel uses the exported app)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on port ${PORT}`)
  })
}

// Export the app for Vercel Serverless Functions
module.exports = app;