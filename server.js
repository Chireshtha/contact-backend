import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs'
import path from 'path';
import multer from 'multer';
import Message from './models/Message.js';
import ContactMsg from './models/ContactMsg.js';
import Subscribe from './models/Subscribe.js';
import  JobApplication from './models/Applyjob.js'

dotenv.config();

const app = express();

const allowedOrigins = [
    'https://chireshtha-portfolio.netlify.app',
    'https://chireshtha-brighture-innovation.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log(`→ ${req.method} ${req.path}`, req.body);
    next();
});
app.get('/', (req, res) => res.send('👋 Contact API is live'));


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

//Create uploads folder if doesn't exist
const uploadDir = 'uploads';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, uploadDir);
    },
    filename:function(req, file, cb){
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({storage});

app.post('/applyjob', upload.single('upload_file'), async (req, res) => {
    const { fullname, email, ph_no, message } = req.body;
    const file_path = req.file ? req.file.path : ''; 
    try{
        const newApply = new JobApplication({ fullname, email, ph_no, upload_file: file_path, message });
        await newApply.save();
        res.status(200).json({ success: true, message: 'Message Saved'});
    }
    catch(error){
        console.log('Error Saving Message:', error);
        res.status(500).json({ success: false, message: 'Failed to save message'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
