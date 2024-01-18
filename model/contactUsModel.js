const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactUsModel = new mongoose.model("Contact", ContactUsSchema);
module.exports = { ContactUsModel };
