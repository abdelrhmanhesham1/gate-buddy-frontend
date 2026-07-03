import Footer from "../shared/Footer.jsx";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import "../style/Home.css";
import { flightAPI } from "../../../utils/Api.js";
import { useAuthGuard } from "../shared/useAuthGuard.js";
import { openApk } from "../../config.js";

// ── Icons ────────────────────────────────────────────────────────────────────
const PlaneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const WheelchairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <circle cx="12" cy="4" r="2" />
    <path d="M10 7L8 13h8l1 4H9.5L8 22H6l1.5-5H6l2-8 2-2z" />
    <circle cx="9" cy="21" r="2" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="17" cy="21" r="2" fill="none" stroke="white" strokeWidth="2" />
  </svg>
);

const QRIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="5" y="5" width="3" height="3" fill="#EDB046" />
    <rect x="16" y="5" width="3" height="3" fill="#EDB046" />
    <rect x="5" y="16" width="3" height="3" fill="#EDB046" />
    <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="#EDB046" />
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#EDB046">
    <circle cx="12" cy="12" r="10" stroke="#EDB046" strokeWidth="2" fill="none" />
    <line x1="12" y1="8" x2="12" y2="12" stroke="#EDB046" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="#EDB046" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CountersIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#EDB046" />
  </svg>
);

const FinancialIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const ShopsIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <path d="M3 9l1-6h16l1 6" />
    <path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
    <path d="M9 9v3a3 3 0 0 0 6 0V9" />
  </svg>
);

const STATUS_COLOR = { DELAYED: "#EDB046", CANCELLED: "#e53e3e", BOARDING: "#38a169", ON_TIME: "#17a2b8", GATE_CHANGE: "#17a2b8" };

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" });
}

// Maps the live flight shape: airline is an object, route.from is an IATA code,
// gate lives under departure.gate, and status is an enum (ON_TIME/DELAYED/…).
function mapFlight(f) {
  const status = f.status || "";
  const nice = status ? status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ") : "—";
  return {
    id: f._id || f.id,
    flight: `Flight: ${f.flightNumber}`,
    status: nice,
    statusColor: STATUS_COLOR[status] || "#EDB046",
    from: f.route?.from || f.route?.fromCode || "—",
    to: f.route?.to || f.route?.toCode || "—",
    beforeLabel: "Departure",
    beforeVal: formatTime(f.departure?.scheduledTime),
    afterLabel: "Departure",
    afterVal: formatTime(f.departure?.estimatedTime),
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FlightUpdatesSection({ flights, showAll, onToggle }) {
  const shown = showAll ? flights : flights.slice(0, 3);
  return (
    <section className="hm-flight-updates">
      <div className="hm-container">
        <h2 className="hm-section-title-plain">
          Stay informed about the latest flight and gate changes
        </h2>
        <div className="hm-cards-row">
          {shown.map((f) => (
            <div className="hm-flight-card" key={f.id}>
              <div className="hm-flight-card-header">
                <span className="hm-flight-num">{f.flight}</span>
                <span
                  className="hm-flight-badge"
                  style={{ background: f.statusColor }}
                >
                  {f.status}
                </span>
              </div>
              <div className="hm-flight-route">
                <span>from</span>
                <strong>{f.from}</strong>
                <span className="hm-arrow">→</span>
                <span>to</span>
                <strong>{f.to}</strong>
              </div>
              <div className="hm-flight-change">
                <span>Before:</span>
                <span className="hm-val-red">{f.beforeLabel} {f.beforeVal}</span>
              </div>
              <div className="hm-flight-change">
                <span>After</span>
                <span className="hm-val-green">{f.afterLabel} {f.afterVal}</span>
              </div>
            </div>
          ))}
        </div>
        {flights.length > 3 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={onToggle}
              style={{
                background: "#002D6B", color: "#EDB046", border: "1.5px solid #EDB046",
                borderRadius: 50, padding: "11px 30px", fontSize: "0.9rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {showAll ? "Show less" : `See more (${flights.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function TrackedFlightSection() {
  const navigate = useNavigate();
  return (
    <section className="hm-tracked">
      <div className="hm-container">
        <h2 className="hm-section-icon-title">
          <span className="hm-icon-circle">
            <PlaneIcon />
          </span>
          Your Tracked Flight
        </h2>
        <div className="hm-tracked-grid">
          <div className="hm-tracked-card">
            <QRIcon />
            <p className="hm-qr-desc">
              Scan your boarding pass QR code to start tracking your flight
            </p>
            <button className="hm-btn-scan" onClick={() => navigate("/scan")}>
              <CameraIcon />
              Scan Your Boarding pass
            </button>
            <button className="hm-btn-download-app" onClick={openApk}>Download App to track</button>
          </div>
          <div className="hm-tracked-img-wrap">
            <img src="/images/scan.jpeg" alt="Travel" className="hm-tracked-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AirportServicesSection() {
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  const services = [
    {
      img: "/images/counters.jpeg",
      icon: <CountersIcon />,
      title: "Counters",
      sub: "Domestic & International",
      path: "/counters",
    },
    {
      img: "/images/img9.jpeg",
      icon: <FinancialIcon />,
      title: "Financial Services",
      sub: "ATM & Currency Exchange",
      path: "/financial",
    },
    {
      img: "/images/img66.jpg",
      icon: <ShopsIcon />,
      title: "Shops & Dining",
      sub: "Dining &shops Options",
    },
  ];

  return (
    <section className="hm-airport-services">
      <div className="hm-container">
        <h2 className="hm-section-icon-title">
          <span className="hm-icon-circle">
            <PlaneIcon />
          </span>
          Airport Services
        </h2>
      </div>

      {/* VIP Banner */}
      <div className="hm-vip-banner">
        <img src="/images/img6.jpeg" alt="VIP" className="hm-vip-bg" />
        <div className="hm-vip-overlay" />
        <div className="hm-vip-content">
          <div className="hm-vip-title-row">
            <PlaneIcon />
            <span className="hm-vip-brand">Gate buddy</span>
            <span>👑</span>
            <span className="hm-vip-sep">| VIP</span>
          </div>
          <p>VIP Experience world where everything is made simple, comfortable, just for you</p>
          <button className="hm-btn-vip" onClick={() => requireAuth(() => navigate("/vip"), "VIP Experience")}>
            <span>🛡️</span>
            VIP Experience
          </button>
        </div>
      </div>

      {/* Service Cards */}
      <div className="hm-container">
        <div className="hm-services-grid">
          {services.map((s, i) => (
            <div
              className="hm-service-card"
              key={i}
              style={s.path ? { cursor: "pointer" } : {}}
              onClick={() => s.path && navigate(s.path)}
            >
              <div className="hm-service-img-wrap">
                <img src={s.img} alt={s.title} className="hm-service-img" />
              </div>
              <div className="hm-service-icon">{s.icon}</div>
              <h3 className="hm-service-title">{s.title}</h3>
              <p className="hm-service-sub">{s.sub}</p>
              <div className="hm-service-discover">
                Discover The Service
                <span className="hm-discover-arrow">▶</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Banner */}
      <div className="hm-access-banner">
        <img src="/images/img11.jpeg" alt="Accessibility" className="hm-access-bg" />
        <div className="hm-access-overlay" />
        <div className="hm-access-content">
          <h2>Accessibility &amp; Assistance ♿</h2>
          <p>
            Enjoy a smoother, more comfortable airport journey with our special assistance
            services shown on the map.
          </p>
          <button className="hm-btn-access" onClick={() => requireAuth(() => navigate("/accessibility"), "Accessibility & Assistance")}>
            <WheelchairIcon />
            Accessibility
          </button>
        </div>
      </div>
    </section>
  );
}

function AirportInfoSection() {
  const infoItems = [
    { icon: "🕐", label: "operation hour", val: "24/24" },
    { icon: "📶", label: "free WiFi", val: "Available" },
    { icon: "📞", label: "contact center", val: "send email" },
    { icon: "🅿️", label: "parking Space", val: "+2500" },
  ];

  return (
    <section className="hm-info-section">
      <div className="hm-container">
        <div className="hm-info-grid">
          {/* Weather */}
          <div className="hm-weather-card">
            <h3 className="hm-weather-title">
              <span>🌤️</span> weather condition
            </h3>
            <div className="hm-weather-body">
              <div className="hm-weather-main">
                <span className="hm-sun">☀️</span>
                <div>
                  <div className="hm-temp">current</div>
                  <div className="hm-temp-val">28 c</div>
                  <div className="hm-temp-desc">sunny</div>
                </div>
                <div className="hm-weather-details">
                  <span>Humidity: 45%</span>
                  <span>visibility: 10 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Airport Info */}
          <div className="hm-airport-info-card">
            <h3 className="hm-info-card-title">
              <InfoIcon />
              Airport Information
            </h3>
            <div className="hm-info-list">
              {infoItems.map((item, i) => (
                <div className="hm-info-item" key={i}>
                  <span className="hm-info-icon">{item.icon}</span>
                  <span className="hm-info-label">{item.label}</span>
                  <span className="hm-info-val">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// ── Main Home Page ────────────────────────────────────────────────────────────
export default function Home() {
  const [flightUpdates, setFlightUpdates] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Full list of today's updated flights (for the "See more" toggle).
    flightAPI.getUpdated({ limit: 30 })
      .then((res) => {
        const raw = res.data?.data?.flights || [];
        setFlightUpdates(raw.map(mapFlight));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="hm-page">
      <Navbar />
      {/* ── Hero ── */}
      <section className="hm-hero">
        <img src="/images/home.jpeg" alt="hero" className="hm-hero-bg" />
        <div className="hm-hero-overlay" />
        <div className="hm-hero-content">
          <h1>Welcome to Gate Buddy</h1>
          <p>
            Your ultimate flight tracking and airport services companion. Stay updated with
            real-time flight information and explore airport amenities.
          </p>
        </div>
      </section>

      <FlightUpdatesSection flights={flightUpdates} showAll={showAll} onToggle={() => setShowAll((v) => !v)} />
      <TrackedFlightSection />
      <AirportServicesSection />
      <AirportInfoSection />
      <Footer />
    </div>
  );
}
