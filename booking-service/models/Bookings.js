const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.STRING, // Could be an ObjectId if referring to MongoDB
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING",
    },
}, { timestamps: true });

module.exports = Booking;
