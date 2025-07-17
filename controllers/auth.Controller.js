const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
require("dotenv").config();

function generate_accessToken(userid, role) {
  const payload = { userid, role };
  const secretKey = process.env.JWT_SECRET_ACCESS;
  const options = { expiresIn: "15m" };
  return jwt.sign(payload, secretKey, options);
}

function generate_refreshToken(userid, role) {
  const payload = { userid, role };
  const secretKey = process.env.JWT_SECRET_REFRESH;
  const options = { expiresIn: "1y" };
  return jwt.sign(payload, secretKey, options);
}

// Sign Up
const signUp = async (req, res, next) => {
  try {
    console.log("Signup request received:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profileImagePath = req.file ? req.file.path : null;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profileImage: profileImagePath,
    });

    const accessToken = generate_accessToken(user._id, user.role);
    const refreshToken = generate_refreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      status: "success",
      data: { accessToken, refreshToken },
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Signup error:", err);
    next(err);
  }
};

//  Login
const logIn = async (req, res, next) => {
  try {
    console.log("Login request received:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect password" });
    }

    const accessToken = generate_accessToken(user._id, user.role);
    const refreshToken = generate_refreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save();

    // Get full image URL if available
    const imageUrl = user.profileImage
      ? `${req.protocol}://${req.get("host")}/${user.profileImage}`
      : null;

    const { password: _, refreshToken: __, ...userData } = user.toObject();

    res.json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: imageUrl,
        },
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refresh_token = req.body.refreshToken || req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(404).json({ message: "No refresh token provided" });
    }

    const payload = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH);

    const foundUser = await User.findById(payload.userid);
    if (!foundUser) {
      return res.status(403).json({ message: "User not found for this token" });
    }

    const newAccessToken = generate_accessToken(payload.userid, payload.role);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};
const handleLogout = async (req, res) => {
  try {
    const refresh_token = req.body.refreshToken || req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    const user = await User.findOne({ refresh_token });
    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { signUp, logIn, handleRefreshToken, handleLogout };
