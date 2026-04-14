const seats = require("../models/seats");

exports.getSeats = (req, res) => {
  res.json(seats);
};