const { ContactUsModel } = require("../../model/contactUsModel");

// RENDER ALL CONTACT-US PAGE
const renderAllContactUsMsg = async (req, res) => {
  try {
    const contacts = await ContactUsModel.find();

    return res.render("admin/allContactMsg", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Contact-us Page",
      contacts,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From All_CONTACT-US:", error?.message);
    return res.render("admin/error");
  }
};

// SWITCH STATUS OF CONTACT-US
const deleteContactUsMsg = async (req, res) => {
  try {
    const contactUsMsgId = req.params.id;
    if (!contactUsMsgId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    await ContactUsModel.findByIdAndDelete(contactUsMsgId);

    return res.redirect("/admin/all-contact-us-msg");
  } catch (error) {
    console.log(`From delete contact-us msg: ${error?.message}`);
    return res.render("admin/error");
  }
};

module.exports = { deleteContactUsMsg, renderAllContactUsMsg };
