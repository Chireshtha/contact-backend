import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js';

dotenv.config();
const app = express();

// ▶️ 1. CUSTOM CORS MIDDLEWARE (must be FIRST)
const allowedOrigins = [
  'https://chireshtha-portfolio.netlify.app',
  'https://chireshtha-brighture-innovation.netlify.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('CORS check origin:', origin);

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      console.log('↪ Preflight OK');
      return res.sendStatus(200);
    }

    return next();
  }

  console.log('⛔ CORS Forbidden for origin:', origin);
  res.status(403).send('CORS Forbidden');
});

// ▶️ 2. BODY PARSER
app.use(express.json());

// ▶️ 3. REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`, req.body);
  next();
});

// ▶️ 4. HEALTH CHECK
app.get('/', (req, res) => res.send('👋 Contact API is live'));

// ▶️ 5. MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ▶️ 6. YOUR ROUTES
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

// ▶️ 7. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
