const express = require("express");
const router = express.Router();

const controller = require("../controllers/seatController");

router.get("/", controller.getSeats);

module.exports = router;