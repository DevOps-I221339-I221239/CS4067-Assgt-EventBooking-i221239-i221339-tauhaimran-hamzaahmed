const express = require("express");
const Booking = require("../models/Bookings");
const router = express.Router();
const amqp = require("amqplib");
const axios = require("axios"); 

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Function to send a message to RabbitMQ
const sendNotification = async (userEmail, message) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("booking_notifications");

        const notification = { userEmail, message };
        channel.sendToQueue("booking_notifications", Buffer.from(JSON.stringify(notification)));

        console.log(`Sent notification to queue: ${userEmail}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("RabbitMQ Error:", error);
    }
};


router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.findAll(); // Use Sequelize's findAll() instead of find()
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { userId, eventId, numTickets } = req.body;
        console.log("Received Request Body:", req.body); // ✅ Log request data

        // Validate input
        if (!userId || !eventId || !numTickets) {
            console.log("Missing required fields");
            console.log("userId:", userId);
            console.log("eventId:", eventId);
            console.log("numberOfTickets:", numTickets);
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userResponse = await axios.get(`http://localhost:5004/users/${userId}`);
        if (!userResponse.data) {
            console.log("User not foundS");
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const eventResponse = await axios.get(`http://localhost:5002/events/${eventId}`);
        if (!eventResponse.data)
            return res.status(400).json({ error: "Invalid event ID" });

        const event = eventResponse.data;
        const userEmail = userResponse.data.email;
        const message = `Your booking for event name: ${event.name} with ID: ${eventId} is confirmed!`;
        await sendNotification(userEmail, message);

        if (!userResponse.data) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const newBooking = new Booking({
            userId,
            eventId,
            numTickets,
            bookingDate: new Date(),
        });
        await newBooking.save();
        res.status(201).json({ booking: newBooking, message: "Booking created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/cancelbooking", async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Validate input
        if (!bookingId) {
            return res.status(400).json({ error: "Missing booking ID" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Delete the booking instead of just updating status
        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/updatebooking", async (req, res) => {
    try {
        const { bookingId, numberOfTickets } = req.body;

        // Validate input
        if (!bookingId || !numberOfTickets) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Update the number of tickets
        booking.numberOfTickets = numberOfTickets;
        await booking.save();

        res.status(200).json({ booking, message: "Booking updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
