import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date, 
        default: Date.now
    },
    interests: {
        type: [String],
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);