import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
    },
    published: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);