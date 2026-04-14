const express = require("express");
const router = express.Router();

const controller = require("../controllers/bookingController");

router.post("/book", controller.bookSeat);
router.post("/cancel", controller.cancelBooking);
router.get("/availability", controller.getAvailability);

module.exports = router;