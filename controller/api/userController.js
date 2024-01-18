const crypto = require("crypto");
const fs = require("fs");
const { join } = require("path");
const { destroyUserAvatar } = require("../../utility/toDestroyAFile");
const { TokenModel } = require("../../model/tokenModel");
const {
  generateToken,
  generateTokenWithCrypto,
  verifyTokenWithCrypto,
} = require("../../service/token.service");
const { HttpException } = require("../../config/httpException");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const niv = require("node-input-validator");
const UserModel = require("../../model/userModel");
const { compareHash, generateHash } = require("../../service/hash.service");
const { UserDto } = require("../../dto/userDto");
const { ServiceModel } = require("../../model/serviceModel");
const { OurTeamModel } = require("../../model/ourTeamModel");
const { TestimonialModel } = require("../../model/testimonialModel");
const {
  saveOtp,
  generateOtp,
  verifyOtp,
} = require("../../service/resetPassword.service");
const {
  sendingOtpViaEmail,
  sendingEmailVerification,
} = require("../../service/mail.service");
const { param } = require("../../router/api/userRoute");
const { UserEnum } = require("../../config/enum");
const { ContactUsModel } = require("../../model/contactUsModel");
const OrderModel = require("../../model/orderModel");
const TableModel = require("../../model/tableModel");
const BookingModel = require("../../model/bookingModel");

// SIGN-UP
const userSignUp = async (req, res) => {
  // Define validation rules and messages outside the function
  const validationRules = {
    name: "required|string|minLength:3",
    email: "required|email|unique:User,email",
    mobile: "required|string|validNo|uniqueNo:User,mobile",
    password: "required|string|minLength:6",
  };

  const validationMessages = {
    en: {
      validNo: "Invalid mobile No..!",
      uniqueNo: "Mobile no already exist..!",
    },
  };
  // Extend validations and messages only once
  niv.extend("unique", async ({ value, args }) => {
    const field = args[1] || "email";

    let condition = {};

    condition[field] = value;

    let emailExist = await mongoose.model(args[0]).findOne(condition);

    // email already exists
    if (emailExist) {
      return false;
    }
    return true;
  });
  niv.extendMessages(validationMessages.en, "en");
  niv.extend("validNo", async ({ value }) => {
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) {
      return false;
    }
    return true;
  });
  niv.extend("uniqueNo", async ({ value, args }) => {
    const field = args[1] || "mobile";

    let condition = {};

    condition[field] = value;

    let mobileNOExist = await mongoose.model(args[0]).findOne(condition);

    // email already exists
    if (mobileNOExist) {
      return false;
    }
    return true;
  });

  try {
    const v = new niv.Validator(req.body, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const hasPw = await generateHash(req.body?.password, 10);

    const userModel = new UserModel({ ...req.body, password: hasPw });
    const newUser = await userModel.save();
    const hashToken = generateTokenWithCrypto();
    sendingEmailVerification(req, newUser, hashToken);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User Registration Success.", user: newUser });
  } catch (error) {
    console.error("Error in sign-up:", error.message);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
// ALL TESTIMONIALS
const verifyUserBeforeLogin = async (req, res) => {
  const { email, token } = req?.params;
  try {
    if (!email || !token)
      throw HttpException(StatusCodes.BAD_REQUEST, "BAD_REQUEST...!");
    const user = await UserModel.findOne({ email });
    const validToken = verifyTokenWithCrypto(token);
    if (!user || !validToken)
      throw new HttpException(StatusCodes.NOT_FOUND, "NOT_FOUND...!");
    await UserModel.findByIdAndUpdate(user._id, { isVerified: true });
    return res.render("admin/verified", { msg: "" });
  } catch (error) {
    console.log(`FORM GET ALL TESTIMONIALS: ${error}`);
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// SIGN-IN
const userSignIn = async (req, res) => {
  const payload = req?.body;

  const validationRules = {
    userName: "required|string",
    password: "required|string|minLength:6",
  };
  try {
    const v = new niv.Validator(req.body, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const user = await UserModel.findOne({
      $or: [{ email: payload?.userName }, { mobile: payload?.userName }],
    });
    if (!user)
      throw new HttpException(StatusCodes.BAD_REQUEST, "User not found..!");
    if (!user.isVerified)
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "User not verify. check your email..!"
      );
    const validPw = await compareHash(payload?.password, user.password);
    if (!validPw)
      throw new HttpException(StatusCodes.UNAUTHORIZED, "UnAuthorized..!");
    const tokenPayload = {
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const accessToken = await generateToken(
      tokenPayload,
      process.env.USER_SECRET
    );

    // SAVE TOKEN IN DB
    const token = await TokenModel.findOne({ userId: user._id });
    if (token) {
      await TokenModel.findOneAndUpdate(
        { userId: user._id },
        { token: accessToken }
      );
    }
    if (!token) {
      const tokenModel = new TokenModel({
        token: accessToken,
        userId: user._id,
      });
      tokenModel.save();
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(StatusCodes.OK).json({
      message: "User Login Success.",
      accessToken,
      isAuthenticated: true,
      user: new UserDto(user),
    });
  } catch (error) {
    console.error("Error in sign-in:", error.message);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
// SEND OTP
async function sendOtpController(req, res) {
  const payload = req.body;

  try {
    const rules = {
      email: "required|email",
    };

    const v = new niv.Validator(payload, rules);
    const isValid = await v.check();

    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }

    const user = await UserModel.findOne({
      email: payload.email,
      role: UserEnum.USER,
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Email not found to reset password..!"
      );
    }

    const otp = await generateOtp();
    const result = await saveOtp(otp, payload.email);

    await sendingOtpViaEmail(user, otp);

    return res.status(StatusCodes.OK).json({
      message: "SUCCESS",
      status: StatusCodes.OK,
      ...result,
      newOtp: otp,
    });
  } catch (error) {
    const statusCode = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      message: error?.message || "Internal Server Error",
      status: statusCode,
    });
  }
}
// VERIFY OTP
async function verifyOtpController(req, res) {
  try {
    const payload = req.body;

    const rules = {
      email: "required|email",
      otp: "required|integer",
    };

    const validator = new niv.Validator(payload, rules);
    const isValid = await validator.check();

    if (!isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: validator.errors });
    }

    const result = await verifyOtp(payload.email, payload.otp);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(status).json({
      message: error?.message || "Internal Server Error",
      status,
    });
  }
}
// RESET PASSWORD VIA OTP
async function resetPasswordViaOtp(req, res) {
  const payload = req.body;
  const email = req.resetPwEmail;

  try {
    const rules = {
      newPassword: "required|string",
    };

    const v = new niv.Validator(payload, rules);
    const isValid = await v.check();

    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }

    if (!email) {
      throw new HttpErrorException(
        StatusCodes.BAD_REQUEST,
        "Email not found from OTP."
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new HttpErrorException(StatusCodes.NOT_FOUND, "User not found.");
    }

    const isSamePassword = await compareHash(
      payload.newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Old password and new password should not be the same.",
        status: StatusCodes.BAD_REQUEST,
        msg: "Old password and new password should not be the same.",
      });
    }

    const hashPassword = await generateHash(payload.newPassword, 10);
    await UserModel.findByIdAndUpdate(user._id, { password: hashPassword });

    return res.status(StatusCodes.OK).json({
      message: "SUCCESS",
      status: StatusCodes.OK,
      msg: "Your password has been updated successfully.",
    });
  } catch (error) {
    console.error("Error in resetting password via OTP:", error.message);
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      message: error?.message || "Internal Server Error",
      status,
    });
  }
}
// AUTO LOGIN && VERIFY TOKEN
const autoLogin = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      res.clearCookie("accessToken");
      throw new HttpException(StatusCodes.NOT_FOUND, "User not fund..!");
    }
    const token = await TokenModel.findOne({ userId: user._id });
    return res.status(StatusCodes.OK).json({
      message: "Token check Success.",
      isAuthenticated: true,
      accessToken: token?.token,
      user: new UserDto(user),
    });
  } catch (error) {
    console.log("From autoLogin:", error?.message);
    // res.status(401).json({ error: error?.message, msg: "UnAuthorization..!" });
    return res
      .status(error?.status || 500)
      .json({ message: error?.message || "internal ServerError..!" });
  }
};
// LOG OUT USER
const userLogOut = (req, res) => {
  try {
    const cookie = req?.cookies?.accessToken;
    if (cookie) {
      res.clearCookie("accessToken");
    }
    return res.status(StatusCodes.OK).json({ message: "Logout Success " });
  } catch (error) {
    const message = error?.message || "Internal Server Error..!";
    const status = error?.status || 500;
    return res.status(status).json(message);
  }
};
// ADD ADDRESS
const addAddress = async (req, res) => {
  const payload = req.body;
  const params = req.params.id;
  const user = req.user;
  try {
    if (!params)
      throw new HttpException(StatusCodes.BAD_REQUEST, "Bad request..!");
    const validationRules = {
      village: "required|string",
      landMark: "required|string",
      post: "required|string",
      ps: "required|string",
      pin: "required|string",
      district: "required|string",
      state: "required|string",
    };
    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const user = await UserModel.findById(params);
    if (!user) throw new HttpException(StatusCodes.NOT_FOUND, "NOT_FOUND...!");
    if (user.address.length >= 3)
      throw new HttpException(StatusCodes.NOT_ACCEPTABLE, "NOT_ACCEPTABLE...!");

    const updatedUser = await UserModel.findByIdAndUpdate(
      params,
      {
        $push: { address: { ...payload, defaultLocation: false } },
      },
      { new: true }
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", user: new UserDto(updatedUser) });
  } catch (error) {
    const message = error?.message || "Internal Server Error..!";
    const status = error?.status || 500;
    return res.status(status).json(message);
  }
};
// CHOOSE ADDRESS
const chooseDefaultAddress = async (req, res) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;
  const user = req.user;
  try {
    if (!userId || !addressId)
      throw new HttpException(StatusCodes.BAD_REQUEST, "Bad request..!");

    const user = await UserModel.findOne({
      $and: [{ _id: userId }, { "address._id": addressId }],
    });
    // CHECK USER IS EXISTS
    if (!user)
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found..!");
    // ========== Start
    const data = await UserModel.findOneAndUpdate(
      { "address._id": addressId },
      {
        $set: {
          "address.$[element].defaultLocation": false,
        },
      },
      {
        new: true,
        arrayFilters: [{ "element.defaultLocation": true }],
      }
    );
    await UserModel.updateOne(
      { _id: userId, "address._id": addressId },
      { $set: { "address.$.defaultLocation": true } },
      { new: true }
    );
    const newUser = await UserModel.findById(user._id);
    // ========== End
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", user: new UserDto(newUser) });
  } catch (error) {
    const message = error?.message || "Internal Server Error..!";
    const status = error?.status || 500;
    return res.status(status).json({ message: message });
  }
};
// USER INFO
const userInfo = async (req, res) => {
  const params = req.params.id;
  const user = req.user;
  try {
    if (!params)
      throw new HttpException(StatusCodes.BAD_REQUEST, "Bad request..!");
    const currentUser = await UserModel.findById(params);

    return res.status(StatusCodes.OK).json({
      message: "Your are a authorized user",
      user: new UserDto(currentUser),
    });
  } catch (error) {
    const message = error?.message || "Internal Server Error..!";
    const status = error?.status || 500;
    return res.status(status).json(message);
  }
};
// UPDATE PROFILE DETAILS
const updateProfile = async (req, res) => {
  const payload = req.body;
  const params = req.params.id;
  const base64Data = req.body.avatar;
  let filename;
  try {
    if (!params)
      throw new HttpException(StatusCodes.BAD_REQUEST, "Bad request..!");
    const validationRules = {
      name: "required|string",
      email: "required|string",
      avatar: "required|string",
      mobile: "required|string",
    };
    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const user = await UserModel.findById(params);
    if (!user) throw new HttpException(StatusCodes.NOT_FOUND, "NOT_FOUND...!");
    const isBase64Url = payload.avatar?.split(",")[0]?.split(";")[1]; // CHECK IS BASE64 URL OR NOT

    let updatedUser;
    if (isBase64Url === "base64") {
      // Remove header information from the base64 string
      const base64Image = base64Data.replace(
        /^data:image\/(jpeg|jpg|png);base64,/,
        ""
      );

      filename = `avatar_${Date.now()}.png`;

      // Write the base64 data to a file
      fs.writeFile(
        join(__dirname, `../../uploads/user/avatar/${filename}`),
        base64Image,
        "base64",
        function (err) {
          if (err) {
            console.error("Error in write file :", err?.message);
            return res
              .status(500)
              .json({ message: "Internal Server Error..!" });
          }
        }
      );
      // save to db
      updatedUser = await UserModel.findByIdAndUpdate(
        params,
        { ...payload, avatar: filename },
        { new: true }
      );
      // destroy previous img
      if (user.avatar !== "user.png") {
        destroyUserAvatar(user.avatar);
      }
    } else {
      const { avatar, ...otherAll } = payload;
      // save to db
      updatedUser = await UserModel.findByIdAndUpdate(
        params,
        { ...otherAll },
        { new: true }
      );
    }
    //
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", user: new UserDto(updatedUser) });
  } catch (error) {
    console.log(error);
    destroyUserAvatar(filename);
    const message = error?.message || "Internal Server Error..!";
    const status = error?.status || 500;
    return res.status(status).json(message);
  }
};
// ADD CONTACT-US MSG
const addContactUsMsg = async (req, res) => {
  const payload = req.body;
  const user = req.user;
  try {
    const validationRules = {
      name: "required|string",
      email: "required|string",
      subject: "required|string",
      message: "required|string",
    };
    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const contactUsModel = new ContactUsModel({ ...payload });
    await contactUsModel.save();

    return res.status(StatusCodes.CREATED).json({ message: "success" });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// GET ALL SERVICES
const getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find({ isActive: true });

    return res.status(StatusCodes.OK).json({ message: "success", services });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// GET ALL TEAMS
const getAllTeams = async (req, res) => {
  try {
    const teams = await OurTeamModel.find({ isActive: true });

    return res.status(StatusCodes.OK).json({ message: "success", teams });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// Check User Ready To Add Testimonials
const checkUserReadyToAddTestimonials = async (req, res) => {
  const { userId } = req?.params;
  try {
    if (!userId)
      throw new HttpException(StatusCodes.BAD_REQUEST, "BAD_REQUEST...!");
    const userOrderSomething = await OrderModel.findOne({ userId });
    const userBookingSomething = await BookingModel.findOne({
      bookingId: userId,
    });
    let readyToAddTestimonials = false;
    if (userOrderSomething || userBookingSomething)
      readyToAddTestimonials = true;

    return res
      .status(StatusCodes.OK)
      .json({ message: "success", readyToAddTestimonials });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// ADD TESTIMONIALS
const addTestimonial = async (req, res) => {
  const { userId } = req?.params;
  const payload = req?.body;
  try {
    const validationRules = {
      feedback: "required|string",
    };
    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();

    if (!match || !userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: v.errors || "BAD_REQUEST...!" });
    }
    const testimonialModel = new TestimonialModel({ ...payload, userId });
    await testimonialModel.save();

    return res.status(StatusCodes.CREATED).json({ message: "success" });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
// ALL TESTIMONIALS
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await TestimonialModel.find({
      isVerified: true,
    }).populate({
      path: "userId",
      select: { password: 0, isVerified: 0, email: 0, mobile: 0 },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", testimonials });
  } catch (error) {
    console.log(`FORM GET ALL TESTIMONIALS: ${error}`);
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
module.exports = {
  userSignUp,
  userSignIn,
  sendOtpController,
  verifyOtpController,
  resetPasswordViaOtp,
  autoLogin,
  userLogOut,
  addAddress,
  userInfo,
  chooseDefaultAddress,
  updateProfile,
  addContactUsMsg,
  getAllServices,
  getAllTeams,
  checkUserReadyToAddTestimonials,
  addTestimonial,
  getAllTestimonials,
  verifyUserBeforeLogin,
};
