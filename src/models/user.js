import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
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
    bio:{
        type: String,
        maxlength: 100,
    },
    profession :{
        type: String,
        enum: ['Student', 'Engineer', 'Doctor', 'Artist', 'Actor','Business','HelthCare','Motivation','Other'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date, 
        default: Date.now - 1000 * 60 * 60 * 24 * 365 * 18, // Default to 18 years ago
    },
    interests: {
        type: [String],
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);