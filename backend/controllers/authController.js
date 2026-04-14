const users = require("../models/users");

exports.login = (req, res) => {
  const { userId } = req.body;

  // ✅ DEBUG INSIDE FUNCTION
  console.log("Incoming userId:", userId);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(400).json({ error: "Invalid user" });
  }

  res.json({
    success: "Login successful",
    user
  });
};