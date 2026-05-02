// backend/routes/insightsRoutes.js

const express    = require('express')
const router     = express.Router()
const Appointment = require('../models/Appointment')
const auth = require('../middleware/auth')

// GET - Full insights analysis
router.get('/', auth, async (req, res) => {
  try {
    const all = await Appointment.find({ clinic: req.clinicId })

    if (all.length === 0) {
      return res.status(200).json({ success: true, data: null, message: 'No data yet' })
    }

    const total     = all.length
    const noShows   = all.filter(a => a.status === 'no-show').length
    const confirmed = all.filter(a => a.status === 'confirmed').length
    const pending   = all.filter(a => a.status === 'pending').length
    const completed = all.filter(a => a.status === 'completed').length
    const reminded  = all.filter(a => a.reminderSent).length
    const noShowRate = total > 0 ? Math.round((noShows / total) * 100) : 0

    // No-shows by day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const byDay = days.map(day => {
      const dayAppts   = all.filter(a => days[new Date(a.appointmentDate).getDay()] === day)
      const dayNoShows = dayAppts.filter(a => a.status === 'no-show').length
      return {
        day: day.slice(0, 3), // Mon, Tue, etc.
        total:   dayAppts.length,
        noShows: dayNoShows,
        rate:    dayAppts.length > 0 ? Math.round((dayNoShows / dayAppts.length) * 100) : 0,
      }
    })

    // No-shows by time of day (buckets)
    const timeSlots = [
      { label: 'Morning',   start: 6,  end: 12 },
      { label: 'Afternoon', start: 12, end: 17 },
      { label: 'Evening',   start: 17, end: 21 },
    ]
    const byTime = timeSlots.map(slot => {
      const slotAppts = all.filter(a => {
        const hour = parseInt((a.appointmentTime || '00:00').split(':')[0])
        return hour >= slot.start && hour < slot.end
      })
      const slotNoShows = slotAppts.filter(a => a.status === 'no-show').length
      return {
        label:   slot.label,
        total:   slotAppts.length,
        noShows: slotNoShows,
        rate:    slotAppts.length > 0 ? Math.round((slotNoShows / slotAppts.length) * 100) : 0,
      }
    })

    // This week vs last week no-show comparison
    const now        = new Date()
    const weekStart  = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd    = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7)
    const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(weekStart.getDate() - 7)

    const thisWeekAppts  = all.filter(a => new Date(a.appointmentDate) >= weekStart && new Date(a.appointmentDate) < weekEnd)
    const lastWeekAppts  = all.filter(a => new Date(a.appointmentDate) >= lastWeekStart && new Date(a.appointmentDate) < weekStart)
    const thisWeekNoShow = thisWeekAppts.filter(a => a.status === 'no-show').length
    const lastWeekNoShow = lastWeekAppts.filter(a => a.status === 'no-show').length

    // Most at-risk day
    const riskiestDay = [...byDay].sort((a, b) => b.rate - a.rate)[0]

    res.status(200).json({
      success: true,
      data: {
        overview: { total, noShows, confirmed, pending, completed, reminded, noShowRate },
        byDay,
        byTime,
        weekComparison: {
          thisWeek:     { appointments: thisWeekAppts.length, noShows: thisWeekNoShow },
          lastWeek:     { appointments: lastWeekAppts.length, noShows: lastWeekNoShow },
        },
        riskiestDay,
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
