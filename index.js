import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userModel from './models/user.js';
import blogModel from './models/blog.js';
import connectDB from './config/db.js';
import multer from 'multer';
// import mongoose from 'mongoose';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(__filename);

const storage = multer.diskStorage({
    destination: join(rootDir, 'userImages'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use('/images', express.static(join(rootDir, 'userImages')));
app.use('/static', express.static(join(rootDir, 'userImages')));


dotenv.config()
connectDB()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
})

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name) {
            return res.send({ message: "Name is required" });
        }
        if (!email) {
            return res.send({ message: "Email is required" });
        }
        if (!password) {
            return res.send({ message: "Password is required" });
        }

        // EXISTING USER
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered please login"
            })
        }

        // REGISTER USER
        const user = await new userModel({ name, email, password }).save();
        res.status(201).send({
            success: true,
            message: "User registered Successfully",
            user: {
                name: user.name,
                email: user.email
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: "Error in registration",
            error
        })
    }
})

app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        // CHECK USER
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                succes: false,
                message: "Email is not registered"
            })
        }

        const match = (password != user.password) ? false : true;
        if (!match) {
            return res.status(200).send({
                succes: false,
                message: "Invalid Password"
            })
        }
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            succes: false,
            message: "Error in Login",
            error
        })
    }

})

app.post("/addblog", upload.single('image'), async (req, res) => {
    try {
        const { title, desc, keyword, author } = req.body
        const imagePath = req.file ? `/images/${req.file.filename}` : null;
        if (!title) {
            return res.send({ message: "Title is required" });
        }
        if (!desc) {
            return res.send({ message: "Description is required" });
        }
        if (!keyword) {
            return res.send({ message: "Keywords are required" });
        }
        if (!author) {
            return res.send({ message: "Author is required" });
        }

        const blog = await new blogModel({ title, desc, keyword, author, imageUrl: imagePath }).save();
        res.status(201).send({
            success: true,
            message: "Blog created Successfully",
            blog: {
                title: blog.title,
                desc: blog.desc
            }
        })

    }
    catch (err) {
        res.send({
            success: false,
            message: "Blog creation failed"
        })
        console.log(err);
    }
})

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await blogModel.find();

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found for the author' });
        }

        // Return the blogs as a response
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/blogs/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const blogs = await blogModel.find({ title });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found for the author' });
        }

        // Return the blogs as a response
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(3001, console.log("Server started at port 3001"));