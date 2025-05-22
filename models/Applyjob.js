import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    ph_no: String,
    upload_file: String,
    message: File,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
})
export default mongoose.model('JobApplication', applicationSchema);