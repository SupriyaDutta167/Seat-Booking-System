// middlewares/roleMiddleware.js
const users = require("../models/users");

exports.isAdmin = (req, res, next) => {
  const userId = req.headers["user-id"];
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user-id header" });
  }

  const user = users.find((u) => u.id === parseInt(userId));
  
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  
  next();
};