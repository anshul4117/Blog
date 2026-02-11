import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    url: { type: String, default: null },
    publicId: { type: String, default: null }
  },
  userId: {
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
blogSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);