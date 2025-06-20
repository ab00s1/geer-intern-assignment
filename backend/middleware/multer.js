const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");


// Multer config: store files in /tmp with unique names
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuid() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
