require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes);

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Sample route
app.get("/", (req, res) => {
    res.send({ message: "Service is running!" });
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
