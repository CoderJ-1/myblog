import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://img.freepik.com/premium-photo/anime-male-avatar_950633-900.jpg'
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    content: {
        type: String,
        minlength:[15],
        required: true,
    },
    slug:{
        type: String,
        required: true,
        unique: true

    }
} , {timestamps: true}
);

   const Post = mongoose.model('Post', postSchema);

   export default  Post;