const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../config/httpException");
const { generateHash, compareHash } = require("./hash.service");
const { OtpModel } = require("../model/otpModel");
const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

// GENERATE-OTP
const generateOtp = async () => {
  const otp = crypto.randomInt(100000, 999999);
  return otp;
};

// SAVE OTP
const saveOtp = async (otp, userName) => {
  try {
    const user = await UserModel.findOne({ email: userName });
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User was not found!");
    }

    const validTime = 1000 * 60 * 2; // 2 minutes
    const expiresIn = Date.now() + validTime;
    const haveClient = await OtpModel.findOne({ userId: user._id });
    const hashData = await generateHash(otp, 10);
    const hashOtp = `${hashData}. ${expiresIn}`;

    if (haveClient) {
      const updateOtp = await OtpModel.findOneAndUpdate(
        { userId: user._id },
        { otp: hashOtp, isVerified: false },
        { new: true }
      );
      // console.log(updateOtp.otp.split(". "));
      // send response
      return {
        OTP: updateOtp?.otp,
        msg: "You receive a email from us.",
      };
    } else {
      const model = new OtpModel({
        userId: user?._id,
        otp: hashOtp,
        isVerified: false,
      });
      const newOtp = await model.save();
      //send response
      return {
        OTP: newOtp.otp,
        msg: "You should receive a email from us.",
      };
    }
  } catch (error) {
    console.error(error.message);
    throw new HttpException(
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message || "Internal Server Error"
    );
  }
};
// VERIFY OTP
const verifyOtp = async (email, otp) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found!");
    }

    const otpData = await OtpModel.findOne({ userId: user._id });
    if (!otpData) {
      throw new HttpException(StatusCodes.NOT_FOUND, "OTP not found!");
    }

    const [hashOtpFromDB, expireTime] = otpData.otp?.split(". ");
    // const hashOtpFromClient = await generateHash(otp, 10);
    const validOtp = await compareHash(otp, hashOtpFromDB);
    if (!validOtp) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid OTP!");
    }

    if (Date.now() > +expireTime) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Expired OTP!");
    }

    const token = await jwt.sign({ email }, process.env.OTP_SECRET, {
      expiresIn: "5min",
    });

    return { message: "SUCCESS", status: StatusCodes.OK, token };
  } catch (error) {
    console.error("Error in verifying OTP:", error.message);
    throw new HttpException(
      error?.status || StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message || "Internal Server Error"
    );
  }
};

module.exports = { generateOtp, saveOtp, verifyOtp };
