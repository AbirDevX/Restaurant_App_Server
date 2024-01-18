const { HttpException } = require("../../config/httpException");
const { Validator } = require("node-input-validator");
const { StatusCodes } = require("http-status-codes");
const { menuAggregation } = require("../../model/aggregation/menuAggregation");
const FoodModel = require("../../model/foodModel");
const UserModel = require("../../model/userModel");
const OrderModel = require("../../model/orderModel");
const {
  orderAggregation,
  totalLengthAggregation,
} = require("../../model/aggregation/orderAggregation");

const paginationMenu = async (req, res) => {
  const query = req?.query;
  const validationRules = {
    skip: "required|string",
    limit: "required|string",
    category: "required|string",
  };
  try {
    const v = new Validator(query, validationRules);
    const match = await v.check();
    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const result = await menuAggregation(
      query?.limit,
      query?.skip,
      query?.category
    );
    const totalLength = await FoodModel.aggregate([
      { $match: { category: query?.category?.toString().toUpperCase() } },
      {
        $group: {
          _id: null,
          totalLength: { $sum: 1 },
        },
      },
    ]);

    return res.status(StatusCodes.OK).json({
      message: "success",
      result,
      totalLength: totalLength[0]?.totalLength,
    });
  } catch (error) {
    console.error("Error in menu pagination:", error);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
const paginationFood = async (req, res) => {
  const query = req?.query;
  const validationRules = {
    skip: "required|string",
    limit: "required|string",
    category: "required|string",
  };
  try {
    const v = new Validator(query, validationRules);
    const match = await v.check();
    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const result = await menuAggregation(
      query?.limit,
      query?.skip,
      query?.category
    );
    const totalLength = await FoodModel.aggregate([
      { $match: { category: query?.category?.toString().toUpperCase() } },
      {
        $group: {
          _id: null,
          totalLength: { $sum: 1 },
        },
      },
    ]);
    return res.status(StatusCodes.OK).json({
      message: "success",
      result,
      totalLength: totalLength[0]?.totalLength,
    });
  } catch (error) {
    console.error("Error in menu pagination:", error);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
const placeOrder = async (req, res) => {
  const payload = req?.body;
  const validationRules = {
    userId: "required|string",
    shippingAddress: "required|string",
    subTotal: "required|integer",
    gst: "required|integer",
    total: "required|integer",
    items: "required|array",
    "items.*.foodId": "required|string",
    "items.*.quantity": "required|integer|min:1",
  };
  try {
    const v = new Validator(payload, validationRules);
    const match = await v.check();
    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const user = await UserModel.findById(payload?.userId);
    if (!user) throw new HttpException(StatusCodes.NOT_FOUND, "NOT_FOUND...!");
    const newOrder = new OrderModel({ ...payload });
    await newOrder.save();
    return res.status(StatusCodes.OK).json({
      message: "success",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error in place order:", error?.message);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
const orderPagination = async (req, res) => {
  const user = req?.user;
  const query = req?.query;
  const validationRules = {
    skip: "required|string",
    limit: "required|string",
    orderStatus: "string|in:cancel,processed,shipped,out_for_delivery,success",
  };
  try {
    const v = new Validator(query, validationRules);
    const match = await v.check();
    if (!match || !user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: v.errors || "Bad request..!" });
    }
    let result = await orderAggregation(
      query?.limit,
      query?.skip,
      query?.orderStatus,
      user
    );
    const totalLength = await totalLengthAggregation(query?.orderStatus, user);

    return res.status(StatusCodes.OK).json({
      message: "success",
      result,
      totalLength: totalLength[0]?.totalLength,
    });
  } catch (error) {
    console.error("Error in menu pagination:", error);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
const orderDetails = async (req, res) => {
  const params = req?.params;
  const validationRules = {
    orderId: "required|string",
  };
  try {
    const v = new Validator(params, validationRules);
    const match = await v.check();
    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const result = await OrderModel.findById(params?.orderId)
      .populate({ path: "userId", select: { password: 0, isVerified: 0 } })
      .populate("items.foodId")
      .exec();
    return res.status(StatusCodes.OK).json({
      message: "success",
      result,
    });
  } catch (error) {
    console.error("Error in menu pagination:", error?.message);
    // Handle specific errors or provide a more user-friendly message
    const errorMessage = error?.message || "Internal Server Error";
    const statusCode = error?.status || 500;

    return res.status(statusCode).json({ error: errorMessage });
  }
};
module.exports = {
  paginationMenu,
  paginationFood,
  placeOrder,
  orderPagination,
  orderDetails,
};
