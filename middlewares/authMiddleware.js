const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = async function (req, res, next) {
  const authHeader = req.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = userData;
    next();
  });
};

module.exports = authenticateToken;
