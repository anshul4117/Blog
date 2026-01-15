import mongoose from 'mongoose';

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
  bio: {
    type: String,
    maxlength: 100,
  },
  profession: {
    type: String,
    enum: ['Student', 'Engineer', 'Doctor', 'Artist', 'Actor', 'Business', 'HelthCare', 'Motivation', 'Other'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  dob: {
    type: Date,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    sparse: true, // Allows null/undefined to be unique (though we'll ensure it's set)
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  interests: {
    type: [String],
  },
  dateOfJoin: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);