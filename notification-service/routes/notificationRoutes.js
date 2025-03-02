const express = require("express");

const router = express.Router();

const Notification = require("../models/Notifications");
const nodemailer = require("nodemailer");

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Send Notification
const sendNotification = async (req, res) => {
    try {
        const { userEmail, message } = req.body;

        // Store notification in database
        const notification = await Notification.create({ userEmail, message });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Booking Confirmation",
            text: message
        });

        // Update status
        notification.status = "SENT";
        await notification.save();

        res.status(200).json({ message: "Notification sent successfully", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post("/", sendNotification); // Send a notification

module.exports = router;
