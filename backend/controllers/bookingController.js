// controllers/bookingController.js
const service = require("../services/bookingService");
const { isValidDateFormat } = require("../utils/dateUtils");

exports.bookSeat = (req, res) => {
  const { userId, date } = req.body;
  
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  const result = service.bookSeat(userId, date);
  if (result.error) return res.status(400).json(result);

  res.json(result);
};

exports.cancelBooking = (req, res) => {
  const { userId, date } = req.body;

  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  const result = service.cancelBooking(userId, date);
  if (result.error) return res.status(400).json(result);

  res.json(result);
};

exports.getAvailability = (req, res) => {
  const { date } = req.query;
  const requesterId = req.headers["user-id"]; // Read who is asking

  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }

  res.json(service.getAvailability(date, requesterId));
};