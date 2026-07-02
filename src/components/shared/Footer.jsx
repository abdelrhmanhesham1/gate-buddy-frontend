import { Link } from "react-router-dom";

const PlaneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: "#002D6B", color: "rgba(255,255,255,0.85)", padding: "48px 0 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "48px", flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: "200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "white", marginBottom: "12px" }}>
            <PlaneIcon />
            <span>Gate Buddy</span>
          </div>
          <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
            Your ultimate flight tracking and airport services companion.<br />
            Making travel easier, one flight at a time.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: "120px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h4 style={{ color: "#EDB046", fontSize: "0.9rem", fontWeight: 700, marginBottom: "4px" }}>Services</h4>
          <a href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Live Flight Board</a>
          <a href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Flight Tracking</a>
          <a href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Airport Services</a>
        </div>
        <div style={{ flex: 1, minWidth: "120px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h4 style={{ color: "#EDB046", fontSize: "0.9rem", fontWeight: 700, marginBottom: "4px" }}>Support</h4>
          <Link to="/chatbot" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Live Chat</Link>
          <a href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>Report Issue</a>
        </div>
        <div style={{ flex: 1, minWidth: "120px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h4 style={{ color: "#EDB046", fontSize: "0.9rem", fontWeight: 700, marginBottom: "4px" }}>Quick Links</h4>
          <Link to="/faq" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>FAQ</Link>
          <a href="#" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>About Us</a>
        </div>
      </div>
    </footer>
  );
}