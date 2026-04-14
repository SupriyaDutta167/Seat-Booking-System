const users = [];

let id = 1;

for (let team = 1; team <= 10; team++) {
  for (let i = 0; i < 4; i++) {
    users.push({ id: id++, team, batch: "A", role: "USER" });
  }
  for (let i = 0; i < 4; i++) {
    users.push({ id: id++, team, batch: "B", role: "USER" });
  }
}

// Optional admin
users.push({ id: 999, team: 0, batch: "A", role: "ADMIN" });

module.exports = users;