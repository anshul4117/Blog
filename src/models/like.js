import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ['Blog', 'Comment'], // Expandable for future
        required: true
    }
}, { timestamps: true });

// Compound Index: A user can only like a specific target once
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model('Like', likeSchema);
