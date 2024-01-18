const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "user.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    isVerified: { type: Boolean, default: false },
    address: [
      {
        defaultLocation: { type: Boolean },
        village: { type: String },
        landMark: { type: String },
        post: { type: String },
        ps: { type: String },
        pin: { type: String },
        district: { type: String },
        state: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
