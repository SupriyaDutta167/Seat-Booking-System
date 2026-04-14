const users = require("../models/users");

exports.getUsers = (req, res) => {
  res.json(users);
};