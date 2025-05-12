import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://chireshtha-portfolio.netlify.app',
  'https://chireshtha-brighture-innovation.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } 
      callback(new Error('Not allowed by CORS'));
    
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.path}`, req.body);
    next();
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error", err));

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const newMsg = new Message({ name, email, subject, message });
    await newMsg.save();
    res.status(200).json({ success: true, message: 'Message Saved' });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.log("Error Saving Message:", error);
    res.status(500).json({ success: false, message: 'Failed to save message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
