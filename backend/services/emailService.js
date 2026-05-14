const nodemailer = require('nodemailer');

const sendAuditEmail = async (leadData, auditFilePath) => {
  let testAccount;
  if (!process.env.EMAIL_USER) {
    testAccount = await nodemailer.createTestAccount();
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASS || testAccount.pass,
    },
  });

  const mailOptions = {
    from: `"AI Nexus Insight" <${process.env.EMAIL_FROM || 'no-reply@insightnexus.ai'}>`,
    to: leadData.email,
    subject: `Your Custom Revenue Audit for ${leadData.clinicName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Your Revenue Audit is Ready!</h2>
        <p>Hello ${leadData.name},</p>
        <p>Thank you for requesting a revenue leak audit for <strong>${leadData.clinicName}</strong>. Our AI has analyzed your inputs and identified significant recovery opportunities.</p>
        <p>Please find your custom strategy deck attached to this email.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <h3 style="margin-top: 0;">Next Steps:</h3>
          <p>We'd love to walk you through these findings and show you how AI Nexus can automate this recovery for you.</p>
          <a href="https://insightnexus.ai/schedule-demo" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Your 15-Min Strategy Session</a>
        </div>
        <p>Best regards,<br>The AI Nexus Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `Audit_${leadData.clinicName.replace(/\s+/g, '_')}.pptx`,
        path: auditFilePath,
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (testAccount) {
    console.log('✉️  Test Email Sent!');
    console.log('🔗  Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
};

module.exports = { sendAuditEmail };
