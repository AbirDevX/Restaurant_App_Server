const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserEnum } = require("../../config/enum");
const { Validator } = require("node-input-validator");
const UserModel = require("../../model/userModel");
const FoodModel = require("../../model/foodModel");
const { destroyFoodImg } = require("../../utility/toDestroyAFile");

// RENDER ALL FOODS PAGE
const renderAllFoods = async (req, res) => {
  try {
    const foods = await FoodModel.find();

    return res.render("admin/allFoods", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Foods Page",
      foods,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From All_FOODS:", error?.message);
    return res.render("admin/error");
  }
};
// RENDER ADD FOOD PAGE
const renderAddFood = async (req, res) => {
  try {
    return res.render("admin/addFood", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      value: "",
      title: "Add Food Page",
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From ADD_FOOD:", error?.message);
    // return res.redirect("/admin/login");
    return res.render("admin/error");
  }
};
// ADD FOOD
const addFood = async (req, res) => {
  const img = req.file;
  const payload = req.body;
  try {
    const v = new Validator(payload, {
      name: "required|string",
      price: "required|integer",
      shallPrice: "required|integer",
      description: "required|string",
      category: "required|string",
      subCategory: "required|string",
    });
    const matched = await v.check();
    if (!matched || !img) {
      img && destroyFoodImg(img.filename);
      return res.render("admin/addFood", {
        error: v.errors,
        title: "Add Food Page",
        admin: req.admin,
        url: req.originalUrl,
        value: req.body,
      });
    }
    const foodModel = new FoodModel({ ...payload, img: img?.filename });
    await foodModel.save();
    req.flash("success", "Food added successFully");

    return res.redirect("/admin/all-foods");
  } catch (error) {
    console.log("From All_FOODS:", error?.message);
    img && destroyFoodImg(img.filename);
    return res.redirect("/admin/login");
  }
};
// SWITCH STATUS OF FOOD
const switchStatusOfFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    if (!foodId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await FoodModel.findById(foodId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    const updatedData = await FoodModel.findByIdAndUpdate(
      foodId,
      {
        isAvailable: !prevValue.isAvailable,
      },
      { new: true }
    );

    return res.redirect("/admin/all-foods");
  } catch (error) {
    console.error(error?.message);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllFoods,
  addFood,
  renderAddFood,
  switchStatusOfFood,
};
