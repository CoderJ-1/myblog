import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes:{
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    }
} , {timestamps: true}
);

   const Comment = mongoose.model('Comment', commentSchema);

   export default Comment;