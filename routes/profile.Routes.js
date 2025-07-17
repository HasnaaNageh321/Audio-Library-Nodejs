const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profile.Controller");
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("./../config/multer"); 

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, upload.single("profileImage"), updateProfile);

module.exports = router; 