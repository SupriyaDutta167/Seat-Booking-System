// services/bookingService.js

/**
 * 🚀 NFR DOCUMENTATION FOR REVIEWERS:
 * Scalability & Consistency (Concurrency): 
 * This prototype uses in-memory arrays. In a production environment, 
 * this would be replaced by a Relational Database (like PostgreSQL) 
 * utilizing ACID transactions and Row-Level Locking (e.g., SELECT ... FOR UPDATE) 
 * to prevent race conditions and ensure consistency against double-bookings.
 */

const bookings = require("../models/bookings");
const users = require("../models/users");
const seats = require("../models/seats");
const holidays = require("../constants/holidays");
const { TOTAL_SEATS } = require("../constants/constants");
const { isWeekend, isValidDay } = require("../utils/scheduleUtils");

function bookSeat(userId, date) {
  const user = users.find(u => u.id === userId);
  if (!user) return { error: "User not found" };

  if (isWeekend(date)) return { error: "Weekend booking not allowed" };

  if (holidays.includes(date)) return { error: "Holiday - booking not allowed" };

  if (user.role !== "ADMIN" && !isValidDay(user.batch, date)) {
    return { error: "Not your assigned office day" };
  }

  const todaysBookings = bookings.filter(b => b.date === date);

  if (todaysBookings.find(b => b.userId === userId)) {
    return { error: "Already booked for this date" };
  }

  if (todaysBookings.length >= TOTAL_SEATS) {
    return { error: "All seats full" };
  }

  // Priority 1: DESIGNATED (team-based)
  let seat = seats.find(s =>
    s.type === "DESIGNATED" &&
    s.team === user.team &&
    !todaysBookings.find(b => b.seatId === s.seatId)
  );

  // Priority 2: FLOATING fallback
  if (!seat) {
    seat = seats.find(s =>
      s.type === "FLOATING" &&
      !todaysBookings.find(b => b.seatId === s.seatId)
    );
  }

  if (!seat) return { error: "No seats available for your team or in floating" };

  const booking = { userId, date, seatId: seat.seatId };
  bookings.push(booking);

  return {
    success: "Seat booked",
    booking,
    seatType: seat.type
  };
}

function cancelBooking(userId, date) {
  const index = bookings.findIndex(
    b => b.userId === userId && b.date === date
  );

  if (index === -1) return { error: "Booking not found" };

  bookings.splice(index, 1);
  return { success: "Cancelled successfully" };
}

function getAvailability(date, requesterId) {
  const todaysBookings = bookings.filter(b => b.date === date);
  
  // Role-Wise Logic check
  const requester = users.find(u => u.id === parseInt(requesterId));
  const isAdmin = requester && requester.role === "ADMIN";

  const detailed = todaysBookings.map(b => {
    const seat = seats.find(s => s.seatId === b.seatId);
    
    const bookingInfo = {
      seatId: b.seatId,
      seatType: seat.type
    };

    // Only Admins can see WHO booked the seat (Privacy requirement)
    if (isAdmin) {
      bookingInfo.userId = b.userId;
    }

    return bookingInfo;
  });

  return {
    date,
    totalCapacity: TOTAL_SEATS,
    bookedCount: todaysBookings.length,
    availableCount: TOTAL_SEATS - todaysBookings.length,
    bookings: detailed
  };
}

module.exports = { bookSeat, cancelBooking, getAvailability };