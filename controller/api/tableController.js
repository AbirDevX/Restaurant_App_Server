const TableModel = require("../../model/tableModel");
const niv = require("node-input-validator");

const { StatusCodes } = require("http-status-codes");
const BookingModel = require("../../model/bookingModel");

const bookingATable = async (req, res) => {
  const payload = req.body;
  const user = req.user;
  try {
    const validationRules = {
      bookingName: "required|string",
      bookingEmail: "required|string",
      bookingDate: "required|string",
      startTime: "required|string",
      durationTime: "required|string",
      bookingId: "required|string",
      tableId: "required|string",
    };
    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();

    if (!match) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: v.errors });
    }
    const bookingModel = new BookingModel({ ...payload });
    await bookingModel.save();
    await TableModel.findByIdAndUpdate(payload.tableId, { isBooked: true });

    return res.status(StatusCodes.CREATED).json({ message: "success" });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};
const getTables = async (req, res) => {
  const user = req.user;
  try {
    const tables = await TableModel.find({ isBooked: false });
    return res.status(StatusCodes.OK).json({ message: "success", tables });
  } catch (error) {
    const status = error?.status || 500;
    const message = error?.message || "Internal server Error..!";
    return res.status(status).json({ message });
  }
};

module.exports = { bookingATable, getTables };
