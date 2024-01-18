const jwt = require("jsonwebtoken");
const UserModel = require("../../model/userModel");
const { HttpException } = require("../../config/httpException");
const { StatusCodes } = require("http-status-codes");

async function isAuthorized(req, res, next) {
  try {
    const authorizationHeader = req.headers?.authorization;

    if (!authorizationHeader) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }
    const token = authorizationHeader.split(" ")[1];
    // const token =  req.cookies && req.cookies["accessToken"];
    jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
      if (err) {
        // res.clearCookie("admin_token");
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "UNAUTHORIZED..!" });
      }
      req.user = decoded;
      return next();
    });
  } catch (error) {
    console.log("From isAuthorized middleware:", error?.message);

    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error..!";

    return res.status(status).json({ message });
  }
}

module.exports = { isAuthorized };
