const mongoose = require("mongoose");
const schema = mongoose.Schema;
const otpSchema = new schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "user",
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model("otp", otpSchema);

module.exports = { OtpModel };
