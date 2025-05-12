import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js'

dotenv.config();


const app = express();
// 1) Manual CORS handler
const allowed = new Set([
  'https://chireshtha-portfolio.netlify.app',
  'https://chireshtha-brighture-innovation.netlify.app'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`CORS: incoming Origin=${origin}, method=${req.method}, path=${req.path}`);
  if (!origin || allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      console.log('↪ Preflight handled');
      return res.sendStatus(200);
    }
    return next();
  }
  console.log('⛔ CORS block for', origin);
  res.status(403).send('CORS Forbidden');
});

// 2) JSON parser
app.use(express.json());

// 3) Simple logger
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`, req.body);
  next();
});

// 4) Health check
app.get('/', (req, res) => res.send('👋 API is live'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDb Connection Error", err));

app.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const newMsg = new Message({ name, email, subject, message });
        await newMsg.save();
        res.status(200).json({ success: true, message: 'Message Saved' });
    }
    catch (error) {
        console.log("Error Saving Message:", error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
});

app.post('/messageme', async (req, res) => {
    const { first_name, last_name, email, ph_no, message } = req.body;
    try {
        const newSecondMsg = new ContactMsg({ first_name, last_name, email, ph_no, message });
        await newSecondMsg.save();
        res.status(200).json({ success: true, message: 'Message Saved' });
    }
    catch (error) {
        console.log("Error Saving Message:", error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
});

app.post('/subscribe', async (req, res) => {
    const { name, email } = req.body;
    try {
        const newSubscribe = new Subscribe({ name, email });
        await newSubscribe.save();
        res.status(200).json({ success: true, message: 'Message Saved' });
    }
    catch (error) {
        console.log("Error Saving Message:", error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));