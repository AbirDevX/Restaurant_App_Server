const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    shallPrice: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    category: {
      type: String,
      enum: ["BREAKFAST", "LUNCH", "DINNER"],
      required: true,
    },
    subCategory: {
      type: String,
      enum: ["VEG", "NON_VEG"],
      required: true,
    },
  },
  { timestamps: true }
);

const FoodModel = mongoose.model("Food", FoodSchema);

module.exports = FoodModel;
