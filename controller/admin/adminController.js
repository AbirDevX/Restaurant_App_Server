const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserEnum } = require("../../config/enum");
const { Validator } = require("node-input-validator");
const UserModel = require("../../model/userModel");
const FoodModel = require("../../model/foodModel");
const { destroyFoodImg } = require("../../utility/toDestroyAFile");

// RENDER ADMIN DASHBOARD
const renderAdminDashboard = (req, res) => {
  if (req.cookies && !req.cookies["admin_token"]) {
    return res.redirect("/admin/login");
  }
  try {
    res.render("admin/dashboard", {
      title: "Dashboard page",
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log(error);
    // return res.redirect("/admin/login");
    return res.render("admin/error");
  }
};
// RENDER ADMIN LOGIN
const renderAdminLogin = (req, res) => {
  if (req.cookies && req.cookies["admin_token"]) {
    return res.redirect("/admin/dashboard");
  }
  try {
    res.render("admin/login", {
      title: "login page",
      value: "",
      error: "",
      url: req.originalUrl,
    });
  } catch (error) {
    // res.render("admin/login", {
    //   title: "home page",
    //   value: "",
    //   error: "",
    //   url: req.originalUrl,
    // });
    return res.render("admin/error");
  }
};
// LOGIN
const adminLogin = async (req, res) => {
  try {
    const payload = req.body;
    // console.log(payload);
    const v = new Validator(payload, {
      userName: "required|string",
      password: "required|string",
    });
    const matched = await v.check();
    if (!matched) {
      // console.log(v.errors);
      return res.render("admin/login", {
        error: v.errors,
        title: "Login Page",
        value: req.body,
        url: req.url,
      });
    }
    // Check Valid Password
    const validUser = await UserModel.findOne({
      $or: [
        { email: req.body.userName, role: UserEnum.ADMIN },
        { mobile: req.body.userName, role: UserEnum.ADMIN },
      ],
    });
    if (!validUser) throw new Error("Not found! Try again..!");
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      validUser.password
    );
    if (!isValidPassword) throw new Error("unauthorized! Try again..!");
    // SET Cookies & Sign The JWT Token
    const tokenPayload = {
      id: validUser._id,
      role: validUser.role,
      avatar: validUser.avatar,
      name: validUser.name,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt,
    };
    const token = jwt.sign(tokenPayload, process.env.ADMIN_SECRET, {
      expiresIn: "24h",
    });
    // console.log(token);
    res.cookie("admin_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2Days
      httpOnly: true,
    });
    // REDIRECT TO PROTECT PAGE
    res.redirect("/admin/dashboard");
    // return res.render("admin/login", {
    //   error: "",
    //   title: "Login Page",
    //   value: req.body,
    // });
  } catch (error) {
    console.log(error?.message);
    return res.render("admin/login", {
      error: { message: error?.message },
      title: "Login Page",
      value: req.body,
      url: req.url,
    });
  }
};
// LOGOUT
const adminLogOut = async (req, res) => {
  if (req.cookies && !req.cookies["admin_token"]) {
    return res.redirect("/admin/login");
  }
  try {
    res.clearCookie("admin_token");
    return res.redirect("/admin/login");
  } catch (error) {
    console.log("form admin logout", error);
    return res.render("admin/error");
  }
};

const renderErrorPage = (req, res) => {
  return res.render("admin/error");
};
module.exports = {
  renderAdminDashboard,
  renderAdminLogin,
  adminLogin,
  adminLogOut,
};
