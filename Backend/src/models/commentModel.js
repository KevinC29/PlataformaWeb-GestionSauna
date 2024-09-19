import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    message: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: false,
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
