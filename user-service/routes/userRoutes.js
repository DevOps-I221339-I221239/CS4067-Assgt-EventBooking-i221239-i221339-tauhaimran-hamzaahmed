const express = require("express");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.get("/", (req, res) => {
    res.json({ message: "User Service is working!" });
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Use Sequelize findByPk()
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ id: user.id, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, type } = req.body; // ✅ Change `userType` to `type`
        console.log(type); // Debugging

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Create user
        const newUser = await User.create({ name, email, password, type });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
});


router.post("/login", async (req, res) => {
    // Handle user login
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
