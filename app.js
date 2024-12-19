// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Set views directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/aboutUs", (req, res) => {
    res.render("aboutUs");
});

app.get("/contactUs", (req, res) => {
    res.render("contactUs");
});

app.get("/programs", (req, res) => {
    res.render("programs");
});

// POST Route for Form Submission
app.post("/send-message", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Save the message to MongoDB
        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

        // Send an email with the form details
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Send confirmation to the user
            subject: `Message received: ${subject}`,
            text: `Thank you for reaching out, ${name}!\n\nWe have received your message:\n${message}\n\nWe will get back to you shortly.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send("Message sent successfully and email confirmation sent.");
    } catch (error) {
        console.error("Error saving message or sending email:", error);
        res.status(500).send("Error saving message or sending email.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
