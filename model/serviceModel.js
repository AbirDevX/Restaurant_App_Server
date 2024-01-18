const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, required: true, default: true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceModel = new mongoose.model("Service", ServiceSchema);
module.exports = { ServiceModel };
