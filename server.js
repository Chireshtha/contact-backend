import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js';

dotenv.config();
const app = express();

// 1) Configure your allowed origins
const allowedOrigins = [
  'https://chireshtha-portfolio.netlify.app',
  'https://chireshtha-brighture-innovation.netlify.app',
  'https://company-contact-backend-nput.onrender.com'
];

// 2) Central CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    // Automatically end preflight requests
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    return next();
  }
  // Reject other origins
  res.status(403).send('CORS Forbidden');
});

// 3) Parse JSON bodies
app.use(express.json());

// 4) Simple health-check
app.get('/', (req, res) => res.send('👋 Contact API is live'));

// 5) Debug logging
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`, req.body);
  next();
});

// 6) Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// 7) Your POST endpoints
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await new Message({ name, email, subject, message }).save();
    res.json({ success: true, message: 'Message Saved' });
  } catch (err) {
    console.error('Error /contact:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/messageme', async (req, res) => {
  try {
    const { first_name, last_name, email, ph_no, message } = req.body;
    await new ContactMsg({ first_name, last_name, email, ph_no, message }).save();
    res.json({ success: true, message: 'Message Saved' });
  } catch (err) {
    console.error('Error /messageme:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/subscribe', async (req, res) => {
  try {
    const { name, email } = req.body;
    await new Subscribe({ name, email }).save();
    res.json({ success: true, message: 'Subscribed' });
  } catch (err) {
    console.error('Error /subscribe:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8) Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
