import { useState, useEffect } from "react";
import API from "./services/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null); 
  const [date, setDate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState("");

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const login = async () => {
    if (!userId) return showMessage("Enter User ID", "error");

    try {
      const res = await API.post("/auth/login", {
        userId: Number(userId),
      });
      setUser(res.data.user);
      localStorage.setItem("seatbook_user_id", res.data.user.id);
      showMessage(`Login successful as ${res.data.user.role}`, "success");
    } catch (err) {
      showMessage("Invalid user", "error");
    }
  };

  const logout = () => {
    setUser(null);
    setUserId("");
    setAvailability(null);
    localStorage.removeItem("seatbook_user_id");
    showMessage("Logged out successfully", "success");
  };

  const bookSeat = async () => {
    if (!user || !date) return showMessage("Login & select date.", "error");
    setLoading("book");
    try {
      const res = await API.post("/bookings/book", {
        userId: user.id, 
        date,
      });
      showMessage(`${res.data.success} (${res.data.seatType} seat)`, "success");
      checkAvailability(); 
    } catch (err) {
      showMessage(err.response?.data?.error || "Booking failed.", "error");
    } finally {
      setLoading("");
    }
  };

  const cancelBooking = async () => {
    if (!user || !date) return showMessage("Login & select date.", "error");
    setLoading("cancel");
    try {
      const res = await API.post("/bookings/cancel", {
        userId: user.id, 
        date,
      });
      showMessage(res.data.success, "success");
      checkAvailability(); 
    } catch (err) {
      showMessage(err.response?.data?.error || "Cancellation failed.", "error");
    } finally {
      setLoading("");
    }
  };

  const checkAvailability = async () => {
    if (!date) return showMessage("Please select a date.", "error");
    if (!user) return showMessage("Please login first to check availability.", "error");
    
    setLoading("check");
    try {
      const res = await API.get(`/bookings/availability?date=${date}`);
      setAvailability(res.data);
    } catch (err) {
      showMessage(err.response?.data?.error || "Could not fetch availability.", "error");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar user={user} onLogout={logout} />

      <main className="main-content">
        <section className="hero">
          <div className="hero-inner">
            <span className="hero-badge">🪑 Smart Seat Booking</span>
            <h1 className="hero-title">Reserve Your <span className="accent">Workspace</span></h1>
            <p className="hero-sub">Book seats instantly, cancel anytime, and check real-time availability.</p>
          </div>
        </section>

        <section className="booking-section">
          <div className="booking-card">
            <div className="card-header">
              <div className="card-icon">📅</div>
              <div>
                <h2>Make a Booking</h2>
                <p>Enter your details below to get started</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>User ID</label>
                <input
                  type="number"
                  placeholder="e.g. 101 or 999 (Admin)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={!!user} 
                />
              </div>

              <div className="field">
                <label>Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {!user && (
              <div className="action-row">
                <button className="btn btn-blue" onClick={login}>
                  🔐 Login
                </button>
              </div>
            )}

            {/* DARK THEME FIX FOR USER INFO */}
            {user && (
              <div className="user-info-box" style={{ 
                padding: "12px", 
                background: "var(--surface-2)", 
                border: "1px solid var(--border)", 
                borderRadius: "10px", 
                marginBottom: "20px",
                textAlign: "center",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "var(--text-muted)" }}>Role:</span> <strong style={{ color: "var(--cyan)" }}>{user.role}</strong> <span style={{ margin: "0 8px", color: "var(--border)" }}>|</span>
                <span style={{ color: "var(--text-muted)" }}>Team:</span> <strong style={{ color: "var(--primary)" }}>{user.team}</strong> <span style={{ margin: "0 8px", color: "var(--border)" }}>|</span>
                <span style={{ color: "var(--text-muted)" }}>Batch:</span> <strong style={{ color: "var(--green)" }}>{user.batch}</strong>
              </div>
            )}

            <div className="action-row">
              <button className="btn btn-green" onClick={bookSeat} disabled={loading === "book" || !user}>
                {loading === "book" ? <span className="spinner" /> : "✔ Book Seat"}
              </button>
              <button className="btn btn-red" onClick={cancelBooking} disabled={loading === "cancel" || !user}>
                {loading === "cancel" ? <span className="spinner" /> : "✖ Cancel Booking"}
              </button>
              <button className="btn btn-blue" onClick={checkAvailability} disabled={loading === "check" || !user}>
                {loading === "check" ? <span className="spinner" /> : "🔍 Check Availability"}
              </button>
            </div>

            {message.text && (
              <div className={`toast toast-${message.type}`}>
                {message.type === "success" ? "✅" : "⚠️"} {message.text}
              </div>
            )}
          </div>
        </section>

        {availability && (
          <section className="availability-section">
            <h3 className="avail-title">Availability for {date}</h3>
            
            {/* NUMBER MAPPING FIX */}
            <div className="avail-grid">
              <div className="avail-card avail-total">
                <span className="avail-num">{availability.totalCapacity ?? availability.total ?? 0}</span>
                <span className="avail-label">Total Seats</span>
              </div>
              <div className="avail-card avail-booked">
                <span className="avail-num">{availability.bookedCount ?? availability.booked ?? 0}</span>
                <span className="avail-label">Booked</span>
              </div>
              <div className="avail-card avail-free">
                <span className="avail-num">{availability.availableCount ?? availability.available ?? 0}</span>
                <span className="avail-label">Available</span>
              </div>
            </div>

            {/* DARK THEME FIX FOR DETAILED LIST */}
            {availability.bookings && availability.bookings.length > 0 && (
              <div style={{ marginTop: "24px", background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <h4 style={{ color: "var(--text-bright)", marginBottom: "16px", fontFamily: "'Sora', sans-serif" }}>Booked Seats Overview</h4>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {availability.bookings.map((b, index) => (
                    <li key={index} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.95rem" }}>
                      <span style={{ marginRight: "10px" }}>🪑</span> 
                      <span style={{ color: "var(--text-muted)" }}>Seat</span> <strong style={{ color: "var(--text-bright)" }}>{b.seatId}</strong> 
                      <span style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginLeft: "6px" }}>({b.seatType})</span>
                      {b.userId && <span style={{ color: "var(--green)", marginLeft: "12px", fontSize: "0.9rem" }}>— Booked by User {b.userId}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;