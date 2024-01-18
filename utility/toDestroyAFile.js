const { unlink } = require("fs");
const { join } = require("path");

const destroyFoodImg = (path) => {
  // Delete any
  unlink(join(__dirname, `../uploads/foods/${path}`), (err) => {
    if (err) console.log(err);
    else {
      console.log("file was deleted.");
    }
  });
};

const destroyPostBanner = (path) => {
  // Delete any
  unlink(join(__dirname, `../uploads/post/${path}`), (err) => {
    if (err) console.log(err);
    else {
      console.log("file was deleted.");
    }
  });
};

const destroyUserAvatar = (path) => {
  // Delete any
  unlink(join(__dirname, `../uploads/user/avatar/${path}`), (err) => {
    if (err) console.log(err?.message);
    else {
      console.log("file was deleted.");
    }
  });
};
const destroyOurTeamAvatar = (path) => {
  // Delete any
  unlink(join(__dirname, `../uploads/team/${path}`), (err) => {
    if (err) console.log(err?.message);
    else {
      console.log("file was deleted.");
    }
  });
};

module.exports = { destroyFoodImg, destroyPostBanner, destroyUserAvatar,destroyOurTeamAvatar };
