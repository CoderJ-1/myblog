import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/premium-photo/anime-male-avatar_950633-900.jpg'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAble: {
        type: Boolean,
        default: false
    }
} , {timestamps: true}
);

   const User = mongoose.model('User', userSchema);

   export default  User;