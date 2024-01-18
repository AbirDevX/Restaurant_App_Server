const mongoose = require("mongoose");

// Define your BookingSchema
const BookingSchema = new mongoose.Schema(
  {
    bookingName: { type: String },
    bookingEmail: { type: String },
    bookingDate: { type: String },
    startTime: { type: String },
    durationTime: { type: String },
    tableId: { type: mongoose.Schema.ObjectId, ref: "Table" },
    bookingId: { type: mongoose.Schema.ObjectId, ref: "User" },
    specialRequest: { type: String },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;
