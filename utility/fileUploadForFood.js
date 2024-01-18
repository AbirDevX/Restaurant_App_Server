const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/foods/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const foodImgUpload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("jpeg") ||
      file.mimetype.includes("webp") ||
      file.mimetype.includes("avif")

    ) {
      callback(null, true);
    } else {
      console.log("only jpg,png,jpeg & webp supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = { foodImgUpload };
