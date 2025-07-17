const User = require("../models/User");

const getProfile = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.userid).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const fullImageUrl = user.profileImage
      ? `${req.protocol}://${req.get("host")}/${user.profileImage}`
      : null;

    res.json({
      message: "Your profile info:",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: fullImageUrl,
      },
    });
  } catch (err) {
    console.log(`Error : ${err}`);
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.userid;

    const updates = {};

    if (name && name.length >= 2) {
      updates.name = name;
    }

    if (req.file) {
      updates.profileImage = req.file.path.replace(/\\/g, "/");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: `${req.protocol}://${req.get("host")}/${
          updatedUser.profileImage
        }`,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    next(err);
  }
};

module.exports = { updateProfile, getProfile };
