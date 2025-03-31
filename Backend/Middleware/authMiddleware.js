const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId !== req.query.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

  module.exports = authMiddleware