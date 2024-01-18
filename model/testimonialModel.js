const mongoose = require("mongoose");
const schema = mongoose.Schema;
const TestimonialSchema = new schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    feedback: {
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

const TestimonialModel = mongoose.model("Testimonial", TestimonialSchema);

module.exports = { TestimonialModel };
