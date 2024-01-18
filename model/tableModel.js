const mongoose = require("mongoose");

// Define a separate counter schema to store auto-increment values
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create a CounterModel to work with the counter collection
const CounterModel = mongoose.model("Counter", CounterSchema);

// Define your TableSchema
const TableSchema = new mongoose.Schema(
  {
    no: { type: Number }, // no longer required and unique
    isActive: { type: Boolean, required: true, default: true },
    isBooked: { type: Boolean, required: true, default: false },
    capacity: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment 'no' field
TableSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "tableCounter" }, // unique identifier for the counter
      { $inc: { seq: 1 } }, // increment 'seq' by 1
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    this.no = counter.seq;
    next();
  } catch (err) {
    next(err);
  }
});

const TableModel = mongoose.model("Table", TableSchema);

module.exports = TableModel;
