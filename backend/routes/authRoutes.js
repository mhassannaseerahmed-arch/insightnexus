const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const Clinic = require('../models/Clinic');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { clinicName, email, password } = req.body;

    // Check if email already exists
    let clinic = await Clinic.findOne({ email });
    if (clinic) {
      return res.status(400).json({ success: false, message: 'Clinic with this email already exists' });
    }

    // Generate Slug
    let slug = slugify(clinicName, { lower: true, strict: true });
    
    // Check if slug exists, if so append random string
    let slugExists = await Clinic.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    clinic = new Clinic({ clinicName, slug, email, password });
    await clinic.save();

    // Create Token
    const token = jwt.sign({ id: clinic._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(201).json({ 
      success: true, 
      token, 
      clinic: { 
        id: clinic._id, 
        clinicName: clinic.clinicName, 
        slug: clinic.slug,
        email: clinic.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const clinic = await Clinic.findOne({ email });
    if (!clinic) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await clinic.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create Token
    const token = jwt.sign({ id: clinic._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(200).json({ 
      success: true, 
      token, 
      clinic: { 
        id: clinic._id, 
        clinicName: clinic.clinicName, 
        slug: clinic.slug,
        email: clinic.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const auth = require('../middleware/auth');

// Get current clinic profile
router.get('/me', auth, async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.clinicId).select('-password');
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }
    res.status(200).json({ success: true, clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/update-profile', auth, async (req, res) => {
  try {
    const { clinicName, phone, address, description, businessHours, smsTemplate } = req.body;
    const clinic = await Clinic.findById(req.clinicId);
    
    if (!clinic) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    if (clinicName) clinic.clinicName = clinicName;
    if (phone) clinic.phone = phone;
    if (address) clinic.address = address;
    if (description) clinic.description = description;
    if (businessHours) clinic.businessHours = businessHours;
    if (smsTemplate) clinic.smsTemplate = smsTemplate;

    await clinic.save();
    res.status(200).json({ success: true, clinic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
