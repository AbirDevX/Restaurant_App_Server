const { Validator } = require("node-input-validator");
const { OurTeamModel } = require("../../model/ourTeamModel");
const { TestimonialModel } = require("../../model/testimonialModel");

// RENDER ALL OurTeam PAGE
const renderAllTestimonials = async (req, res) => {
  try {
    const testimonials = await TestimonialModel.find().populate({
      path: "userId",
      select: { password: 0, isVerified: 0, email: 0, mobile: 0 },
    });

    return res.render("admin/testimonials", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Testimonials Page",
      testimonials,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From OUR_TEAMS:", error?.message);
    return res.render("admin/error");
  }
};
// SWITCH STATUS OF OurTeam
const verifyTestimonials = async (req, res) => {
  try {
    const testimonialsId = req?.params?.id;
    if (!testimonialsId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await TestimonialModel.findById(testimonialsId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await TestimonialModel.findByIdAndUpdate(
      testimonialsId,
      {
        isVerified: !prevValue.isVerified,
      },
      { new: true }
    );

    return res.redirect("/admin/all-testimonials");
  } catch (error) {
    console.log(`From switching OurTeam: ${error?.message}`);
    return res.render("admin/error");
  }
};
// SWITCH STATUS OF OurTeam
const deleteTestimonials = async (req, res) => {
  try {
    const testimonialsId = req?.params?.id;
    if (!testimonialsId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await TestimonialModel.findById(testimonialsId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await TestimonialModel.findByIdAndDelete(testimonialsId);

    return res.redirect("/admin/all-testimonials");
  } catch (error) {
    console.log(`From switching OurTeam: ${error?.message}`);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllTestimonials,
  verifyTestimonials,
  deleteTestimonials,
};
