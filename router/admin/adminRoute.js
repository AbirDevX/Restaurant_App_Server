const express = require("express");
const { isAdmin } = require("../../middleware/auth/isAdmin");
const {
  postUpload,
  foodImgUpload,
} = require("../../utility/fileUploadForFood");
const { teamImgUpload } = require("../../utility/filleUploadForTeam");
const {
  renderAdminDashboard,
  renderAdminLogin,
  adminLogin,
  adminLogOut,
} = require("../../controller/admin/adminController");
const {
  addFood,
  renderAddFood,
  renderAllFoods,
  switchStatusOfFood,
} = require("../../controller/admin/adminFoodController");
const {
  renderAllTables,
  renderAddTable,
  addTable,
  switchStatusOfTable,
  switchTableBookingStatus,
} = require("../../controller/admin/tableController");
const {
  renderAllServices,
  renderAddService,
  addService,
  switchStatusOfService,
} = require("../../controller/admin/servicesController");
const {
  renderAllOurTeams,
  renderAddOurTeam,
  addOurTeam,
  switchStatusOfTeam,
} = require("../../controller/admin/ourTeamController");
const { destroyOurTeamAvatar } = require("../../utility/toDestroyAFile");
const { deleteContactUsMsg, renderAllContactUsMsg } = require("../../controller/admin/contactUsController");
const { renderAllTestimonials, deleteTestimonials, verifyTestimonials } = require("../../controller/admin/testimonialsController");
const { renderAllOrders, switchOrderStatusOfSuccess, switchOrderStatusOfCancel, switchOrderStatusOfShipped, switchOrderStatusOfOutForDelivery } = require("../../controller/admin/orderController");

const adminRoute = express.Router();

/*============== AUTH ================*/

adminRoute.get("/login", renderAdminLogin); // ADMIN LOGIN RENDER
adminRoute.post("/login", adminLogin); // ADMIN LOGIN

adminRoute.get("/dashboard", isAdmin, renderAdminDashboard); // ADMIN DASHBOARD RENDER

/*============== ORDER ================*/
adminRoute.get("/all-orders", isAdmin, renderAllOrders); // RENDER ALL ORDERS
adminRoute.get("/switchOrderStatusToSuccess/:id", isAdmin, switchOrderStatusOfSuccess); // ORDERS TO SUCCESS
adminRoute.get("/switchOrderStatusToCancel/:id", isAdmin, switchOrderStatusOfCancel); // ORDERS TO CANCEL
adminRoute.get("/switchOrderStatusToShipped/:id", isAdmin, switchOrderStatusOfShipped); // ORDERS TO SHIPPED 
adminRoute.get("/switchOrderStatusToOutForDelivery/:id", isAdmin, switchOrderStatusOfOutForDelivery); // ORDERS TO SHIPPED OUT_FOR_DELIVERY



/*============== FOODS ================*/

adminRoute.get("/all-foods", isAdmin, renderAllFoods); // RENDER ALL FOODS
adminRoute.get("/add-food", isAdmin, renderAddFood); // RENDER ADD FOOD PAGE
adminRoute.post("/add-food", foodImgUpload.single("img"), isAdmin, addFood); // ADD FOOD
adminRoute.get("/switch-food-status/:id", isAdmin, switchStatusOfFood); // SWITCH FOOD

/*============== TABLE ================*/

adminRoute.get("/all-tables", isAdmin, renderAllTables); // RENDER ALL TABLES PAGE
adminRoute.get("/add-table", isAdmin, renderAddTable); // RENDER ADD TABLE PAGE
adminRoute.post("/add-table", isAdmin, addTable); // ADD TABLE
adminRoute.get("/switch-table-status/:id", isAdmin, switchStatusOfTable); // SWITCH TABLE
adminRoute.get("/switch-booking-status/:id", isAdmin, switchTableBookingStatus); // SWITCH BOOKING STATUS


/*============== SERVICE ================*/

adminRoute.get("/all-services", isAdmin, renderAllServices); // RENDER ALL SERVICE PAGE
adminRoute.get("/add-service", isAdmin, renderAddService); // RENDER ADD SERVICE PAGE
adminRoute.post("/add-service", isAdmin, addService); // ADD SERVICE
adminRoute.get("/switch-service-status/:id", isAdmin, switchStatusOfService); // SWITCH SERVICE

/*============== OUT-TEAM ================*/

adminRoute.get("/all-teams", isAdmin, renderAllOurTeams); // RENDER ALL OUR_TEAM PAGE
adminRoute.get("/add-team", isAdmin, renderAddOurTeam); // RENDER ADD OUR_TEAM PAGE
adminRoute.post("/add-team", teamImgUpload.single("avatar"), isAdmin, addOurTeam); // ADD OUR_TEAM
adminRoute.get("/switch-team-status/:id", isAdmin, switchStatusOfTeam); // SWITCH OUR_TEAM

/*============== CONTACT-US ================*/

adminRoute.get("/all-contact-us-msg", isAdmin, renderAllContactUsMsg); // RENDER ALL CONTACT-US PAGE
adminRoute.get("/contact-us-status/:id", isAdmin, deleteContactUsMsg); // DELETE CONTACT-US

// adminRoute.get("/error", renderErrorPage); // ADD FOOD

/*============== TESTIMONIALS ================*/
adminRoute.get("/all-testimonials", isAdmin, renderAllTestimonials); // DELETE CONTACT-US
adminRoute.get("/remove-testimonials/:id", isAdmin, deleteTestimonials); // DELETE CONTACT-US
adminRoute.get("/verify-testimonials/:id", isAdmin, verifyTestimonials); // DELETE CONTACT-US

adminRoute.get("/logout", isAdmin, adminLogOut); // ADMIN LOG OUT

module.exports = adminRoute;
