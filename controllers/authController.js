const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const verificationUrl = `http://localhost:${process.env.PORT}/api/auth/verify-email?token=${token}`;

        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `<h3>Verify your email</h3><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        res.status(201).json({ message: 'User registered. Check your email for verification link.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.verified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

        await transporter.sendMail({
            to: user.email,
            subject: 'Welcome!',
            html: `<h3>Welcome to our Email-Auth-Apllication!</h3><p>Your email has been successfully verified.</p>`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error });
    }
};

module.exports = { register, verifyEmail };
