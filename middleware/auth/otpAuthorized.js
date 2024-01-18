const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

async function otpAuthorization(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Token not found..!",
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const decoded = await jwt.verify(token, process.env.OTP_SECRET);

    if (!decoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "OTP token has expired",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    req.resetPwEmail = decoded.email;
    next();
  } catch (error) {
    console.error("Error in OTP authorization:", error.message);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized access",
      status: StatusCodes.UNAUTHORIZED,
    });
  }
}

module.exports = { otpAuthorization };
