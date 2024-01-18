const nodemailer = require("nodemailer");

function sendingEmail(req, user, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PW,
    },
  });
  const mailOptions = {
    from: "no-reply@abir.com",
    to: user.email,
    subject: "Account Verification",
    text:
      "Hello " +
      req?.body?.name +
      ",\n\n" +
      "Please verify your account by clicking the link: \nhttp://" +
      req.headers.host +
      "/user/confirmation/" +
      user.email +
      "/" +
      token +
      "\n\nThank You!\n",
  };
  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(400).json({
        result: err,
        message: "Technical Issue",
      });
    }
  });
}

const sendingOtpViaEmail = (user, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PW,
    },
  });

  const mailOptions = {
    from: "no-reply@jontyabir.com",
    to: user?.email,
    subject: "Reset Password",
    text: `Hello ${user?.name},\n\nYour Reset-password OTP is: ${otp}\n\nThank You!\n`,
  };

  return transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Email sent successfully.");
    })
    .catch((err) => {
      console.error("Error sending email:", err);
      throw new HttpErrorException(400, "Technical Issue");
    });
};
function sendingEmailVerification(req, user, token) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PW,
    },
  });
  const mailOptions = {
    from: "no-reply@abir.com",
    to: user.email,
    subject: "Account Verification",
    text:
      "Hello " +
      user.name +
      ",\n\n" +
      "Please verify your account by clicking the link: " +`\n${req.protocol}://${req.headers.host}/api/verify-user/${user.email}/${token}`+ "\n\nThank You!\n",
  };
  // console.log(mailOptions);
  transporter.sendMail(mailOptions, function (err) {
    if (err) {
     return res.status(400).json({
        result: err,
        message: "Technical Issue",
      });
    }
  });
}

module.exports = { sendingEmail, sendingOtpViaEmail, sendingEmailVerification };
