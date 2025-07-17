const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signUp, logIn, handleRefreshToken, handleLogout } = require("../controllers/auth.Controller");
const upload = require("./../config/multer");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

router.get("/test", (req, res) => {
  res.json({ status: "success", message: "Auth routes are working" });
});

router.post(
  "/signup",
  upload.single("profileImage"),
  [
    check("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/[0-9!@#$%^&*]/)
      .withMessage(
        "Password must contain at least one number or special character"
      ),
    check("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage('Role must be either "user" or "admin"'),
  ],
  signUp
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  logIn
);
router.post("/refreshToken", handleRefreshToken);
router.post("/logout", handleLogout);
module.exports = router;
