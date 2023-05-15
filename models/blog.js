import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    keyword: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        trim: true
    },
    imageUrl: String
})

export default mongoose.model('Blog', blogSchema);

