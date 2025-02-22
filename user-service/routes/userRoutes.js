const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "User Service is working!" });
});

router.post("/signup", (req, res) => {
    // Handle user signup
    res.json({ message: "User signed up!" });
});

router.post("/login", (req, res) => {
    // Handle user login
    res.json({ message: "User logged in!" });
});

module.exports = router;
