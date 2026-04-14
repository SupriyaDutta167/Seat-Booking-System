const seats = [];

for (let i = 1; i <= 50; i++) {
  seats.push({
    seatId: i,
    type: i <= 40 ? "DESIGNATED" : "FLOATING",
    team: i <= 40 ? Math.ceil(i / 4) : null
  });
}

module.exports = seats;