import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js'

dotenv.config();

const allowedOrigins = [
    'https://chireshtha-portfolio.netlify.app',
    'https://chireshtha-brighture-innovation.netlify.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log("Origin:", origin); 
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new Error('Not allowed by Cors'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
};

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
app.use(express.json());


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