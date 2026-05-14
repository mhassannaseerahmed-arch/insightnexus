const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { generateAuditReport } = require('../services/auditGenerator');

router.post('/request-audit', async (req, res) => {
  try {
    const { name, email, clinicName, phone, appts, rate, avgRevenue, fillRate } = req.body;
    
    // Save Lead
    const lead = new Lead({ name, email, clinicName, phone, metadata: { appts, rate, avgRevenue, fillRate } });
    await lead.save();

    // Generate Audit
    const auditPath = await generateAuditReport({ ...lead.toObject(), appts, rate, avgRevenue, fillRate });
    lead.auditPath = auditPath;
    lead.status = 'audit-sent';
    await lead.save();

    res.status(201).json({ 
      success: true, 
      message: 'Audit report generated successfully!',
      leadId: lead._id,
      downloadUrl: `/api/leads/download-audit/${lead._id}`
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

