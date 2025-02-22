const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    // Handle booking creation
    res.json({ message: "Booking created!" });
});

router.post("/payments", (req, res) => {
    // Mock Payment processing
    res.json({ message: "Payment processed!" });
});

module.exports = router;
