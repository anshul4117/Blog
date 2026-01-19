import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000 // Prevent massive spam comments
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
        index: true // Critical for fetching comments by blog
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Adjacency List Pattern for Threading
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true // Critical for fetching replies
    },
    // Soft Delete Flag
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Optimize query performance for nested comments
commentSchema.index({ blogId: 1, parentId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
