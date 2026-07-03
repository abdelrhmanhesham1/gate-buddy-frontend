import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationsAPI } from "../../../utils/Api.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [, setAboutOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const userPhoto = user?.photo || "https://i.pravatar.cc/40";

  useEffect(() => {
    if (!isAuthenticated) { setUnreadCount(0); return; }
    let alive = true;
    notificationsAPI
      .getUnreadCount()
      .then((res) => { if (alive) setUnreadCount(res.data?.data?.unreadCount || 0); })
      .catch(() => {});
    return () => { alive = false; };
  }, [isAuthenticated]);

  return (
    <>
      <style>{`
        .nb-nav {
          background: #002D6B;
          color: white;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
        }
        .nb-logo span { color: #EDB046; font-size: 1.3rem; }
        .nb-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .nb-links a {
          color: white;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nb-links a:hover { color: #EDB046; }
        .nb-dropdown-btn {
          background: none;
          border: none;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0;
          font-family: inherit;
          transition: color 0.2s;
        }
        .nb-dropdown-btn:hover { color: #EDB046; }
        .nb-dropdown-wrap { position: relative; }
        .nb-dropdown-menu {
          position: absolute;
          top: 32px;
          left: 0;
          background: white;
          color: black;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          width: 160px;
          overflow: hidden;
          z-index: 100;
        }
        .nb-dropdown-menu a {
          display: block;
          padding: 10px 16px;
          font-size: 0.85rem;
          color: #002D6B;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nb-dropdown-menu a:hover { background: #f5f5f5; }
        .nb-icons {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nb-icons svg {
          cursor: pointer;
          color: white;
          transition: color 0.2s;
          width: 20px;
          height: 20px;
        }
        .nb-icons svg:hover { color: #EDB046; }
        .nb-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #EDB046;
          cursor: pointer;
          object-fit: cover;
        }
        .nb-hamburger {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
        }
        .nb-mobile-menu {
          position: absolute;
          top: 60px;
          left: 0;
          width: 100%;
          background: #001f4d;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 24px 0;
          z-index: 49;
        }
        .nb-mobile-menu a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nb-mobile-menu a:hover { color: #EDB046; }
        @media (max-width: 768px) {
          .nb-links { display: none; }
          .nb-icons { display: none; }
          .nb-hamburger { display: block; }
        }
      `}</style>

      <nav className="nb-nav">
        {/* Logo */}
        <div className="nb-logo">
          <span>✈</span>
          <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
            Gate Buddy
          </h1>
        </div>

        {/* Desktop Links */}
        <ul className="nb-links">
          <li><Link to="/home">Home</Link></li>

          {/* Booking */}
          <li className="nb-dropdown-wrap">
            <button
              className="nb-dropdown-btn"
              onClick={() => {
                setBookingOpen(!bookingOpen);
                setAboutOpen(false);
              }}
            >
              BooKing <ChevronDown size={16} />
            </button>
            {bookingOpen && (
              <div className="nb-dropdown-menu">
                <Link to="/Airline" onClick={() => setBookingOpen(false)}>Airline</Link>
                <Link to="/Hotels" onClick={() => setBookingOpen(false)}>Hotels</Link>
              </div>
            )}
          </li>

          <li><Link to="/map">Map</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
          <li><Link to="/contact">Contact</Link></li>
           <li><Link to="/about">About us </Link></li>
        </ul>

        {/* Icons */}
        <div className="nb-icons">
          <Search />
          <span style={{ position: "relative", display: "inline-flex" }}>
            <Bell />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -6, minWidth: 16, height: 16,
                padding: "0 4px", borderRadius: 8, background: "#EDB046", color: "#002D6B",
                fontSize: "0.6rem", fontWeight: 800, display: "flex", alignItems: "center",
                justifyContent: "center", lineHeight: 1,
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
          <Link to="/profile">
            <img
              src={userPhoto}
              alt="profile"
              className="nb-avatar"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="nb-hamburger">
          {isOpen ? (
            <X size={24} onClick={() => setIsOpen(false)} />
          ) : (
            <Menu size={24} onClick={() => setIsOpen(true)} />
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="nb-mobile-menu">
          <Link to="/home" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/map" onClick={() => setIsOpen(false)}>Map</Link>
          <Link to="/chatbot" onClick={() => setIsOpen(false)}>Chatbot</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/Booking" onClick={() => setIsOpen(false)}>Booking</Link>

          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </>
  );
}