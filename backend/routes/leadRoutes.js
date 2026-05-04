const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { generateAuditReport } = require('../services/auditGenerator');
const { sendAuditEmail } = require('../services/emailService');

router.post('/request-audit', async (req, res) => {
  try {
    const { name, email, clinicName, phone, appts, rate } = req.body;
    
    // Save Lead
    const lead = new Lead({ name, email, clinicName, phone, metadata: { appts, rate } });
    await lead.save();

    // Generate Audit as Base64
    const auditBase64 = await generateAuditReport({ ...lead.toObject(), appts, rate });
    
    // Email the Audit
    try {
      await sendAuditEmail({ name, email, clinicName }, auditBase64);
      lead.status = 'audit-sent';
    } catch (mailErr) {
      console.error('Email Error:', mailErr.message);
      lead.status = 'audit-generated-email-failed';
    }
    
    await lead.save();

    res.status(201).json({ 
      success: true, 
      message: 'Audit report generated and emailed successfully!',
      auditData: auditBase64, // Keep for fallback download
      fileName: `Audit_${clinicName.replace(/\s+/g, '_')}.pptx`
    });
  } catch (err) {
    console.error('Audit Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate audit report' });
  }
});

// Download Audit Route
router.get('/download-audit/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.auditPath) return res.status(404).send('Audit not found');
    
    res.download(lead.auditPath);
  } catch (err) {
    res.status(500).send('Download failed');
  }
});

module.exports = router;

