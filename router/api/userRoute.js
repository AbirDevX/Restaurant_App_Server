const express = require("express");
const {
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
} = require("../../controller/api/userController");
const { otpAuthorization } = require("../../middleware/auth/otpAuthorized");
const { isAuthorized } = require("../../middleware/auth/isAuthorized");
const {
  paginationMenu,
  paginationFood,
  placeOrder,
  orderPagination,
  orderDetails,
} = require("../../controller/api/userFoodController");
const {
  bookingATable,
  getTables,
} = require("../../controller/api/tableController");

const userRoute = express.Router();

/*===================USER-AUTH=========================*/
userRoute.post("/sign-up", userSignUp);
userRoute.post("/sign-in", userSignIn);
userRoute.get("/verify-user/:email/:token", verifyUserBeforeLogin);
userRoute.get("/logout", isAuthorized, userLogOut);

/*==============RESET-PASSWORD================*/
userRoute.post("/reset-password/send-otp", sendOtpController);
userRoute.post("/reset-password/verify-otp", verifyOtpController);
userRoute.post("/reset-password", otpAuthorization, resetPasswordViaOtp); // POST

userRoute.get("/verify-token", isAuthorized, autoLogin);

/*============== USER ================*/
userRoute.get("/user-info/:id", isAuthorized, userInfo); // GET USER INFO
userRoute.post("/add-address/:id", isAuthorized, addAddress); // ADD ADDRESS
userRoute.patch("/update-profile/:id", isAuthorized, updateProfile); // UPDATE PROFILE
userRoute.patch( "/choose-default-address/:userId/:addressId", isAuthorized, chooseDefaultAddress ); // CHOOSE DEFAULT ADDRESS

/*============== FOODS ================*/
userRoute.get("/menu-pagination", isAuthorized, paginationMenu); // FOR MENU
userRoute.get("/food-pagination", isAuthorized, paginationFood); // FOR FOOD
userRoute.post("/place-order", isAuthorized, placeOrder); // PLACE ORDER
userRoute.get("/orders-pagination", isAuthorized, orderPagination); // FOR FOOD
userRoute.get("/order-details/:orderId", isAuthorized, orderDetails); // GET ORDER DETAILS

/*============== TABLE ================*/
userRoute.post("/booking-table", isAuthorized, bookingATable); // PLACE ORDER
userRoute.get("/get-tables", isAuthorized, getTables); // GET TABLES

/*============== CONTACT-US ================*/
userRoute.post("/contact-us", isAuthorized, addContactUsMsg); // PLACE ORDER

/*============== SERVICES ================*/
userRoute.get("/get-services", isAuthorized, getAllServices); // GET SERVICES

/*============== TEAMS ================*/
userRoute.get("/get-teams", isAuthorized, getAllTeams); // GET TABLES

/*============== TESTIMONIALS ================*/

userRoute.get("/ready-to-add-testimonials/:userId", isAuthorized, checkUserReadyToAddTestimonials); // CHECK
userRoute.post("/add-testimonials/:userId", isAuthorized, addTestimonial); // ADD TESTIMONIALS
userRoute.get("/testimonials", isAuthorized, getAllTestimonials); // GET ALL TESTIMONIALS


module.exports = userRoute;
