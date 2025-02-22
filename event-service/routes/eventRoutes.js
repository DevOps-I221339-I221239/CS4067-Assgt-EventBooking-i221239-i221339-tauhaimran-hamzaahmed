const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "List of events!" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `Details for event ${req.params.id}` });
});

module.exports = router;
