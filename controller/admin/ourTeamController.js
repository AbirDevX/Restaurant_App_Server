const { Validator } = require("node-input-validator");
const { OurTeamModel } = require("../../model/ourTeamModel");
const {
  destroyFoodImg,
  destroyOurTeamAvatar,
} = require("../../utility/toDestroyAFile");
// RENDER ALL OurTeam PAGE
const renderAllOurTeams = async (req, res) => {
  try {
    const ourTeams = await OurTeamModel.find();

    return res.render("admin/allTeams", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      title: "All Out Teams Page",
      ourTeams,
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From OUR_TEAMS:", error?.message);
    return res.render("admin/error");
  }
};
// RENDER ADD OurTeam PAGE
const renderAddOurTeam = async (req, res) => {
  try {
    return res.render("admin/addTeam", {
      error: "",
      flashMsg: {
        error: req.flash("error"),
        msg: req.flash("msg"),
        success: req.flash("success"),
      },
      value: "",
      title: "Add Our Team Page",
      admin: req.admin,
      url: req.originalUrl,
    });
  } catch (error) {
    console.log("From RENDER ADD_OUR_TEAM:", error?.message);
    // return res.redirect("/admin/login");
    return res.render("admin/error");
  }
};
// ADD OurTeam
const addOurTeam = async (req, res) => {
  const file = req?.file;
  const payload = req.body;
  try {
    const v = new Validator(payload, {
      name: "required|string",
      designation: "required|string",
      faceBookLik: "required|string",
      twitterLink: "required|string",
      instagramLink: "required|string",
    });
    const matched = await v.check();
    if (!matched || !file) {
      // console.log(file);
      file && destroyOurTeamAvatar(file?.filename);
      return res.render("admin/addTeam", {
        error: v.errors,
        title: "Add OurTeam Page",
        admin: req.admin,
        url: req.originalUrl,
        value: req.body,
      });
    }
    const ourTeamModel = new OurTeamModel({
      ...payload,
      avatar: file?.filename,
      socialMedia: {
        faceBookLik: payload?.faceBookLik,
        twitterLink: payload?.twitterLink,
        instagramLink: payload?.instagramLink,
      },
    });
    await ourTeamModel.save();
    req.flash("success", "Team added successFully");

    return res.redirect("/admin/all-teams");
  } catch (error) {
    file && destroyOurTeamAvatar;
    console.log("From ADD OurTeam:", error?.message);
    return res.render("admin/error");
  }
};
// SWITCH STATUS OF OurTeam
const switchStatusOfTeam = async (req, res) => {
  try {
    const teamId = req?.params?.id;
    if (!teamId) {
      throw new httpException(StatusCodes.BAD_REQUEST, "Bad Request..!");
    }

    const prevValue = await OurTeamModel.findById(teamId);
    if (!prevValue) {
      throw new Error("Not found..!");
    }

    await OurTeamModel.findByIdAndUpdate(
      teamId,
      {
        isActive: !prevValue.isActive,
      },
      { new: true }
    );

    return res.redirect("/admin/all-teams");
  } catch (error) {
    console.log(`From switching OurTeam: ${error?.message}`);
    return res.render("admin/error");
  }
};

module.exports = {
  renderAllOurTeams,
  renderAddOurTeam,
  addOurTeam,
  switchStatusOfTeam,
};
