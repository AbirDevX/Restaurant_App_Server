const { Validator } = require("node-input-validator");
const TableModel = require("../../model/tableModel");

// RENDER ALL TABLES PAGE
const renderAllTables = async (req, res) => {
  try {
    const tables = await TableModel.find();

    return res.render("admin/allTables", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Services Page",
      tables,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From All_TABLES:", error?.message);
    return res.render("admin/error");
  }
};
// RENDER ADD TABLE PAGE
const renderAddTable = async (req, res) => {
  try {
    return res.render("admin/addTable", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      value: "",
      title: "Add Table Page",
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From RENDER ADD_Table:", error?.message);
    // return res.redirect("/admin/login");
    return res.render("admin/error");
  }
};
// ADD TABLE
const addTable = async (req, res) => {
  const payload = req.body;
  try {
    const v = new Validator(payload, {
      name: "required|string",
      capacity: "required|integer",
    });
    const matched = await v.check();
    if (!matched) {
      // console.log(v.errors);

      return res.render("admin/addTable", {
        error: v.errors,
        title: "Add Table Page",
        admin: req.admin,
        url: req.originalUrl,
        value: req.body,
      });
    }
    const tableModel = new TableModel({ ...payload });
    await tableModel.save();
    req.flash("success", "Table added successFully");

    return res.redirect("/admin/all-tables");
  } catch (error) {
    console.log("From ADD TABLE:", error?.message);
    return res.render("admin/error");
  }
};
// SWITCH STATUS OF TABLE
const switchStatusOfTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    if (!tableId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await TableModel.findById(tableId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await TableModel.findByIdAndUpdate(
      tableId,
      {
        isActive: !prevValue.isActive,
      },
      { new: true }
    );

    return res.redirect("/admin/all-tables");
  } catch (error) {
    console.log(`From switching TABLE: ${error?.message}`);
    return res.render("admin/error");
  }
};
// SWITCH BOOKING STATUS OF TABLE
const switchTableBookingStatus = async (req, res) => {
  try {
    const tableId = req.params.id;
    if (!tableId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await TableModel.findById(tableId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await TableModel.findByIdAndUpdate(
      tableId,
      {
        isBooked: !prevValue.isBooked,
      },
      { new: true }
    );

    return res.redirect("/admin/all-tables");
  } catch (error) {
    console.log(`From switching TABLE: ${error?.message}`);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllTables,
  addTable,
  renderAddTable,
  switchStatusOfTable,
  switchTableBookingStatus,
};
