const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Root Test Route
app.get('/', (req, res) => {
  res.send('Portfolio API is live');
});

// POST: Contact form handler
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  console.log('New Contact Message:', { name, email, message });

  // Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // Your Gmail address
      pass: process.env.EMAIL_PASS      // App Password (not your normal Gmail password)
    }
  });

  // Safe and compatible mailOptions
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,  // Gmail requires the sender to match authenticated user
    to: process.env.EMAIL_USER,                     // Send to yourself
    replyTo: email,                                 // So you can reply directly to sender
    subject: `Portfolio Contact from ${name}`,
    text: `You received a new message from your portfolio:

Name: ${name}
Email: ${email}

Message:
${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    res.status(200).send('Message sent successfully!');
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    res.status(500).send('Failed to send message');
  }
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
