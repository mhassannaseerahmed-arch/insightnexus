// backend/routes/waitlistRoutes.js

const express = require('express')
const router  = express.Router()
const Waitlist = require('../models/Waitlist')
const auth = require('../middleware/auth')

// POST - Join waitlist
router.post('/join', async (req, res) => {
  try {
    const { email, clinicType } = req.body
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

    const existing = await Waitlist.findOne({ email })
    if (existing) {
      return res.status(200).json({ success: true, message: 'You are already on the waitlist!' })
    }

    const entry = new Waitlist({ email, clinicType })
    await entry.save()

    res.status(201).json({
      success: true,
      message: 'You are on the waitlist! I will reach out personally within 48 hours.',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET - Get all waitlist entries (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ joinedAt: -1 })
    res.status(200).json({ success: true, count: entries.length, data: entries })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
