const { OrderEnum } = require("../../config/enum");
const OrderModel = require("../../model/orderModel");
// RENDER ALL FOODS PAGE
const renderAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();

    return res.render("admin/allOrders", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Orders Page",
      orders,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From All_FOODS:", error?.message);
    return res.render("admin/error");
  }
};
// SWITCH STATUS TO SUCCESS
const switchOrderStatusOfSuccess = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await OrderModel.findById(orderId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: OrderEnum.SUCCESS,
      },
      { new: true }
    );

    return res.redirect("/admin/all-orders");
  } catch (error) {
    console.error(error?.message);
    return res.render("admin/error");
  }
};

// SWITCH STATUS TO CANCEL
const switchOrderStatusOfCancel = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await OrderModel.findById(orderId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: OrderEnum.CANCEL,
      },
      { new: true }
    );

    return res.redirect("/admin/all-orders");
  } catch (error) {
    console.error(error?.message);
    return res.render("admin/error");
  }
};

// SWITCH STATUS TO SHIPPED
const switchOrderStatusOfShipped = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await OrderModel.findById(orderId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: OrderEnum.SHIPPED,
      },
      { new: true }
    );

    return res.redirect("/admin/all-orders");
  } catch (error) {
    console.error(error?.message);
    return res.render("admin/error");
  }
};

// SWITCH STATUS TO DELIVERY
const switchOrderStatusOfOutForDelivery = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await OrderModel.findById(orderId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await OrderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: OrderEnum.OUT_FOR_DELIVERY,
      },
      { new: true }
    );

    return res.redirect("/admin/all-orders");
  } catch (error) {
    console.error(error?.message);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllOrders,
  switchOrderStatusOfSuccess,
  switchOrderStatusOfOutForDelivery,
  switchOrderStatusOfCancel,
  switchOrderStatusOfShipped,
};
