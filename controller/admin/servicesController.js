const { Validator } = require("node-input-validator");
const { ServiceModel } = require("../../model/serviceModel");

// RENDER ALL SERVICES PAGE
const renderAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find();

    return res.render("admin/allServices", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Service Page",
      services,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From All_SERVICES:", error?.message);
    return res.render("admin/error");
  }
};
// RENDER ADD SERVICE PAGE
const renderAddService = async (req, res) => {
  try {
    return res.render("admin/addService", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      value: "",
      title: "Add service Page",
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From RENDER ADD_SERVICE:", error?.message);
    // return res.redirect("/admin/login");
    return res.render("admin/error");
  }
};
// ADD TABLE
const addService = async (req, res) => {
  const payload = req.body;
  try {
    const v = new Validator(payload, {
      icon: "required|string",
      title: "required|string",
      description: "required|string",
    });
    const matched = await v.check();
    if (!matched) {
    //   console.log(v.errors);

      return res.render("admin/addService", {
        error: v.errors,
        title: "Add Service Page",
        admin: req.admin,
        url: req.originalUrl,
        value: req.body,
      });
    }
    const serviceModel = new ServiceModel({ ...payload });
    await serviceModel.save();
    req.flash("success", "Service added successFully");

    return res.redirect("/admin/all-services");
  } catch (error) {
    console.log("From ADD SERVICE:", error?.message);
    return res.render("admin/error");
  }
};
// SWITCH STATUS OF SERVICE
const switchStatusOfService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    if (!serviceId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await ServiceModel.findById(serviceId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await ServiceModel.findByIdAndUpdate(
      serviceId,
      {
        isActive: !prevValue.isActive,
      },
      { new: true }
    );

    return res.redirect("/admin/all-services");
  } catch (error) {
    console.log(`From switching TABLE: ${error?.message}`);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllServices,
  renderAddService,
  addService,
  switchStatusOfService,
};
