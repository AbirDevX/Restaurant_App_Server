const { default: mongoose } = require("mongoose");
const OrderModel = require("../orderModel");
const orderAggregation = async (limit, skip, orderStatus, user) => {
  const id = new mongoose.Types.ObjectId(user?._id);
  if (orderStatus) {
    return await OrderModel.aggregate([
      {
        $match: {
          orderStatus: orderStatus?.toString().toUpperCase(),
          userId: id,
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "foods",
          localField: "items.foodId",
          foreignField: "_id",
          as: "foodInfo",
        },
      },
    ]);
  }
  return await OrderModel.aggregate([
    {
      $match: {
        userId: id,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "foods",
        localField: "items.foodId",
        foreignField: "_id",
        as: "foodInfo",
      },
    },
  ]);
};

const totalLengthAggregation = async (orderStatus, user) => {
  const id = new mongoose.Types.ObjectId(user?._id);
  if (orderStatus) {
    return await OrderModel.aggregate([
      {
        $match: {
          orderStatus: orderStatus?.toString().toUpperCase(),
          userId: id,
        },
      },
      {
        $group: {
          _id: null,
          totalLength: { $sum: 1 },
        },
      },
    ]);
  }
  return await OrderModel.aggregate([
    {
      $match: {
        userId: id,
      },
    },
    {
      $group: {
        _id: null,
        totalLength: { $sum: 1 },
      },
    },
  ]);
};
module.exports = { orderAggregation, totalLengthAggregation };
