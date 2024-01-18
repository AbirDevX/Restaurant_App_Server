const mongoose = require("mongoose");

const OurTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    avatar: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    socialMedia: {
      faceBookLik: { type: String, required: true },
      twitterLink: { type: String, required: true },
      instagramLink: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const OurTeamModel = new mongoose.model("Team", OurTeamSchema);
module.exports = { OurTeamModel };
