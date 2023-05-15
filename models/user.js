import mongoose from "mongoose";
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';
// import blogSchema from './blog.js'

dotenv.config()
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const skey = "adityasecret@database@key.is.this";
userSchema.plugin(encrypt, { secret: skey, encryptedFields: ["password"] })

export default mongoose.model('User', userSchema);