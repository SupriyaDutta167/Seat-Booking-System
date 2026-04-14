import "../App.css";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">🪑 SeatBook</span>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/availability">Availability</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
        <span className="footer-copy">© {year} SeatBook. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;