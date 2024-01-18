const UserEnum = Object.freeze({
  USER: "USER",
  ADMIN: "ADMIN",
});

const OrderEnum = Object.freeze({
  CANCEL: "CANCEL",
  PROCESSED: "PROCESSED",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  SUCCESS: "SUCCESS",
});

const FoodCategoryEnum = Object.freeze({
  BREAKFAST: "BREAKFAST",
  LUNCH: "LUNCH",
  DINNER: "DINNER",
});

const FoodSubCategoryEnum = Object.freeze({
  VEG: "VEG",
  NON_VEG: "NON_VEG",
});
module.exports = { UserEnum, OrderEnum, FoodCategoryEnum, FoodSubCategoryEnum };
