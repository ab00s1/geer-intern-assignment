const express = require("express");
const upload = require("./multer");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const router = express.Router();
const { authenticate } = require('./Authentication');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dfnyqhhsp",
  api_key: "716577392911956",
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Upload endpoint
router.post("/upload", authenticate, upload.single("image"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
    });

    // Remove temp file
    fs.unlinkSync(filePath);

    res.json({
      message: "Upload successful",
      cloudinaryUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
});

module.exports = router;