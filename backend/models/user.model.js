import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://tmpfiles.nohat.cc/visualhunter-c6a963c5e9.png"
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;