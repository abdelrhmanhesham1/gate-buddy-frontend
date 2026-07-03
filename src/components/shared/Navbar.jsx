import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationsAPI, servicesAPI } from "../../../utils/Api.js";

const CATEGORY_ROUTE = {
  COUNTERS: "/counters",
  VIP_SERVICES: "/vip",
  FINANCIAL: "/financial",
  ACCESSIBILITY: "/accessibility",
};

const POLL_MS = 45000;

// Short two-note chime via Web Audio (no asset needed).
function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = freq;
      const t = now + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.start(t); o.stop(t + 0.32);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch { /* audio blocked — the OS notification still chimes */ }
}

function notifyBrowser(title, body) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title || "Gate Buddy", { body: body || "", icon: "/gatebuddy_logo.jpg" });
    }
  } catch { /* ignore */ }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [, setAboutOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userPhoto = user?.photo || "https://i.pravatar.cc/40";
  const prevCountRef = useRef(null);

  // Poll for notifications; on a new one (flight reminder / update) chime + notify.
  useEffect(() => {
    if (!isAuthenticated) { setUnreadCount(0); prevCountRef.current = null; return; }
    let alive = true;

    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } catch { /* ignore */ }

    const poll = async () => {
      try {
        const res = await notificationsAPI.getUnreadCount();
        if (!alive) return;
        const count = res.data?.data?.unreadCount || 0;
        const prev = prevCountRef.current;
        if (prev !== null && count > prev) {
          playChime();
          try {
            const latest = await notificationsAPI.getAll({ limit: 1 });
            const n = latest.data?.data?.notifications?.[0];
            notifyBrowser(n?.title, n?.message);
          } catch { notifyBrowser("Gate Buddy", "You have a new notification"); }
        }
        prevCountRef.current = count;
        setUnreadCount(count);
      } catch { /* ignore */ }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { alive = false; clearInterval(id); };
  }, [isAuthenticated]);

  const openSearch = () => { setSearchOpen((v) => !v); setNotifOpen(false); };

  const runSearch = async (e) => {
    e?.preventDefault();
    const q = searchQ.trim();
    if (!q) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await servicesAPI.search(q);
      setSearchResults(res.data?.data?.services || []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  // Live search: query as the user types (debounced 300ms).
  useEffect(() => {
    const q = searchQ.trim();
    if (!q) { setSearchResults([]); setSearching(false); return; }
    setSearching(true);
    const t = setTimeout(() => { runSearch(); }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQ]);

  const goResult = (svc) => {
    setSearchOpen(false);
    setSearchQ("");
    setSearchResults([]);
    navigate(CATEGORY_ROUTE[svc.category] || "/home");
  };

  const openNotif = async () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setSearchOpen(false);
    if (next) {
      try {
        const res = await notificationsAPI.getAll({ limit: 10 });
        setNotifs(res.data?.data?.notifications || []);
      } catch { setNotifs([]); }
    }
  };

  const markAll = async () => {
    try { await notificationsAPI.markAllRead(); } catch { /* ignore */ }
    setUnreadCount(0);
    prevCountRef.current = 0;
    setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  };

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
        .nb-icon-wrap { position: relative; display: inline-flex; }
        .nb-badge {
          position: absolute; top: -6px; right: -6px; min-width: 16px; height: 16px;
          padding: 0 4px; border-radius: 8px; background: #EDB046; color: #002D6B;
          font-size: 0.6rem; font-weight: 800; display: flex; align-items: center;
          justify-content: center; line-height: 1;
        }
        .nb-panel {
          position: absolute; top: 34px; right: 0; background: #fff; color: #1a2a4a;
          border-radius: 12px; box-shadow: 0 8px 30px rgba(0,45,107,0.2);
          width: 300px; z-index: 200; overflow: hidden; border: 1px solid #e5eaf5;
        }
        .nb-search-input {
          width: 100%; box-sizing: border-box; border: none; border-bottom: 1px solid #eef;
          padding: 12px 16px; font-size: 0.9rem; outline: none; color: #1a2a4a;
        }
        .nb-results { max-height: 320px; overflow-y: auto; }
        .nb-result { padding: 10px 16px; cursor: pointer; border-bottom: 1px solid #f4f6fb; }
        .nb-result:hover { background: #f5f8ff; }
        .nb-result-name { font-size: 0.85rem; font-weight: 600; color: #002D6B; }
        .nb-result-cat { font-size: 0.72rem; color: #8899bb; margin-top: 2px; }
        .nb-empty { padding: 16px; text-align: center; color: #9aaabb; font-size: 0.82rem; }
        .nb-panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1px solid #eef; font-weight: 700;
          font-size: 0.85rem; color: #002D6B;
        }
        .nb-markall { background: none; border: none; color: #EDB046; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
        .nb-notif { padding: 10px 16px; border-bottom: 1px solid #f4f6fb; }
        .nb-notif.unread { background: #f5f8ff; }
        .nb-notif-title { font-size: 0.82rem; font-weight: 700; color: #002D6B; }
        .nb-notif-msg { font-size: 0.76rem; color: #556; margin-top: 2px; }
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
          {/* Search */}
          <span className="nb-icon-wrap">
            <Search style={{ cursor: "pointer" }} onClick={openSearch} />
            {searchOpen && (
              <div className="nb-panel">
                <form onSubmit={runSearch}>
                  <input
                    autoFocus
                    className="nb-search-input"
                    placeholder="Search services…"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </form>
                <div className="nb-results">
                  {searching ? (
                    <div className="nb-empty">Searching…</div>
                  ) : searchResults.length === 0 ? (
                    <div className="nb-empty">{searchQ ? "No results — press Enter" : "Type and press Enter"}</div>
                  ) : (
                    searchResults.slice(0, 8).map((s) => (
                      <div key={s._id} className="nb-result" onClick={() => goResult(s)}>
                        <div className="nb-result-name">{s.name}</div>
                        <div className="nb-result-cat">{s.category}{s.terminal ? ` · ${s.terminal}` : ""}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </span>

          {/* Notifications */}
          <span className="nb-icon-wrap">
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Bell style={{ cursor: "pointer" }} onClick={openNotif} />
              {unreadCount > 0 && (
                <span className="nb-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </span>
            {notifOpen && (
              <div className="nb-panel">
                <div className="nb-panel-head">
                  <span>Notifications</span>
                  {notifs.length > 0 && <button className="nb-markall" onClick={markAll}>Mark all read</button>}
                </div>
                <div className="nb-results">
                  {notifs.length === 0 ? (
                    <div className="nb-empty">No notifications</div>
                  ) : (
                    notifs.map((n) => (
                      <div key={n._id} className={`nb-notif ${n.read ? "" : "unread"}`}>
                        <div className="nb-notif-title">{n.title}</div>
                        <div className="nb-notif-msg">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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