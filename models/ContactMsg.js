import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    ph_no: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
    })

    export default mongoose.model('ContactMsg', contactSchema);