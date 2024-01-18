const FoodModel = require("../foodModel");
const menuAggregation = async (limit, skip, category) => {
  return await FoodModel.aggregate([
    { $match: { category: category?.toString().toUpperCase() } },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]);
};
module.exports = { menuAggregation };
