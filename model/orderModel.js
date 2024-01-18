const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        foodId: { type: mongoose.Types.ObjectId, ref: "Food", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: ["CANCEL", "PROCESSED", "SHIPPED", "OUT_FOR_DELIVERY", "SUCCESS"],
      default: "PROCESSED",
    },
    subTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
