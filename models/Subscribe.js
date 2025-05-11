import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    name: String,
    email: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
})
export default mongoose.model('Subscribe', subscribeSchema);