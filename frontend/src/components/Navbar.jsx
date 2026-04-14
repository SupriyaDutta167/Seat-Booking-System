import "../App.css";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        <span className="brand-icon">🪑</span>
        SeatBook
      </a>
      <ul className="navbar-links" style={{ alignItems: "center" }}>
        <li><a href="/">Home</a></li>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "8px" }}>
            <span className="nav-text" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Hi, <strong style={{ color: "var(--text-bright)" }}>{user.role === "ADMIN" ? "Admin" : `User ${user.id}`}</strong>
            </span>
            <button 
              className="nav-cta" 
              onClick={onLogout}
              style={{ border: "none", padding: "6px 16px", cursor: "pointer", fontSize: "0.85rem" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <li><span className="nav-cta" style={{ padding: "6px 16px" }}>Login Required</span></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;