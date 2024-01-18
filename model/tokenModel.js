const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: 86400000,
      },
    },
  },
  { timestamps: true }
);

const TokenModel = new mongoose.model("token", TokenSchema);
module.exports = { TokenModel };
