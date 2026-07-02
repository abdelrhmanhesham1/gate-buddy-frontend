import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../style/main1.css";
import { useAuthGuard } from "../shared/useAuthGuard.js";

// ── Icons (inline SVGs) ──────────────────────────────────────────────────────
const PlaneIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const StarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5A623">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#F5A623">
    <circle cx="11" cy="11" r="8" stroke="#F5A623" strokeWidth="2" fill="none"/>
    <path d="M21 21l-4.35-4.35" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#F5A623" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const LuggageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#F5A623">
    <rect x="6" y="8" width="12" height="14" rx="2" stroke="#F5A623" strokeWidth="2" fill="none"/>
    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="#F5A623" strokeWidth="2" fill="none"/>
    <line x1="12" y1="12" x2="12" y2="18" stroke="#F5A623" strokeWidth="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const FlightIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const AirportIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
    <rect x="2" y="16" width="20" height="2" rx="1" fill="#F5A623"/>
    <path d="M4 16V8l4-4h8l4 4v8" fill="none"/>
    <path d="M9 16V11h6v5" fill="none"/>
  </svg>
);

const RatingIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const WheelchairIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="4" r="2"/>
    <path d="M10 7L8 13h8l1 4H9.5L8 22H6l1.5-5H6l2-8 2-2z"/>
    <circle cx="9" cy="21" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17" cy="21" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const VIPCrownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M2 20h20v2H2zM4 18l4-8 4 4 4-6 4 10H4z"/>
  </svg>
);

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <PlaneIcon size={28} color="#F5A623" />
          <span className="logo-text">Gate Buddy</span>
        </div>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#about">About</a>
          <Link to="/contact">Contact Us</Link>
                  </div>
        <div className="nav-actions">
          <button className="btn-primary nav-download" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ── Hero Slides Data ─────────────────────────────────────────────────────────
const heroSlides = [
  {
    title: "Connecting You to the World",
    subtitle: "\"Experience fast check-ins, seamless transfers, and personalized support, making every journey through our airport safe and effortless.\"",
  },
  {
    title: "Your Journey Starts Here",
    subtitle: "\"Real-time gate updates, flight info, and personalized assistance — all in one place, making travel stress-free.\"",
  },
  {
    title: "Travel Smarter Every Time",
    subtitle: "\"Gate Buddy guides you through every step of your airport journey, from check-in to boarding with ease.\"",
  },
  {
    title: "Safe & Effortless Travel",
    subtitle: "\"With Gate Buddy, enjoy seamless airport navigation, VIP services, and 24/7 assistance wherever you are.\"",
  },
];

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {/* Sky + clouds background image */}
      <div className="hero-bg" />
      <div className="hero-overlay" />

      {/* Plane image on right */}
      <div className="hero-plane-visual">
        <div className="plane-css" />
      </div>

      {/* Sign Up / Log In */}
      <div className="hero-auth-btns">
  <button 
    className="btn-auth"
    onClick={() => navigate("/signup")}
  >
    Sign UP
  </button>

  <button 
    className="btn-auth"
    onClick={() => navigate("/login")}
  >
    Log In
  </button>
  </div>
      {/* Slide content */}
      <div className="hero-content">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === current ? "active" : ""}`}
          >
            <h1 className="hero-title">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <button className="btn-hero" onClick={() => requireAuth(() => navigate("/home"))}>Learn More</button>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {heroSlides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}

// ── Welcome ──────────────────────────────────────────────────────────────────
function Welcome() {
  return (
    <section className="welcome">
      <div className="container">
        <div className="section-title-row">
          <PlaneIcon size={28} color="#F5A623" />
          <h2>Welcome to Gate Buddy</h2>
        </div>
        <p className="welcome-bold">Discover a new way to travel effortlessly!</p>
        <p className="welcome-body">
          Get real-time gate updates, flight info, and personalized assistance — all in one place.
          Gate Buddy makes every step of your airport journey smoother, faster, and stress-free.
        </p>
      </div>
    </section>
  );
}

// ── Metrics ──────────────────────────────────────────────────────────────────
function Metrics() {
  const metrics = [
    { icon: <UsersIcon />, label: "Active Users", value: "12,450" },
    { icon: <FlightIcon />, label: "Flight Tracked/Delays", value: "3,256/112" },
    { icon: <AirportIcon />, label: "Airports Covered", value: "85" },
    { icon: <RatingIcon />, label: "User Rating", value: "4.8/5" },
  ];

  return (
    <section className="metrics">
      <div className="container">
        <div className="section-title-row">
          <span className="emoji-icon">📊</span>
          <h2>Gate Buddy Key Metrics</h2>
        </div>
        <p className="section-sub">Trusted by millions of travelers worldwide</p>
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <div className="metric-card" key={i}>
              <div className="metric-icon">{m.icon}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Save Time Banner ──────────────────────────────────────────────────────────
function SaveTimeBanner() {
  return (
    <section className="save-time">
      <div className="save-time-grid">
        <div className="save-img-grid-left">
          <div className="save-img-wrap">
            <img src="/images/img2.jpeg" alt="" className="save-img-tag" />
          </div>
          <div className="save-img-wrap">
            <img src="/images/img3.jpeg" alt="" className="save-img-tag" />
          </div>
        </div>
        <div className="save-text">
          <h2>Save Your Time and Travel Smarter with Gate Buddy</h2>
          <p>Discover how Gate Buddy streamlines every step of your airport journey – from check-in to boarding – so you can focus on what really matters: enjoying your trip.</p>
        </div>
        <div className="save-img-grid-right">
          <div className="save-img-wrap">
            <img src="/images/img444.jpg" alt="" className="save-img-tag" />
          </div>
          <div className="save-img-wrap">
            <img src="/images/img5.jpeg" alt="" className="save-img-tag" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: <SearchIcon />, label: "Search &\nTrack flights" },
    { icon: <BellIcon />, label: "Get Real-Time\nAlerts" },
    { icon: <LuggageIcon />, label: "Access\nAirport Services" },
    { icon: <PlaneIcon size={32} color="#F5A623" />, label: "Travel Smarter\n& On Time" },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <h2 className="section-heading">How it works?</h2>
        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step-item" key={i}>
              <div className="step-icon-wrap">
                {s.icon}
              </div>
              {i < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line" />
                  <div className="connector-dot" />
                </div>
              )}
              <div className="step-label">{s.label.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── VIP Banner ────────────────────────────────────────────────────────────────
function VIPBanner() {
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  return (
    <section className="vip-banner">
      <img src="/images/img666.jpg" alt="VIP" className="vip-bg-img" />
      <div className="vip-overlay" />
      <div className="vip-content">
        <div className="vip-title-row">
          <PlaneIcon size={28} color="#F5A623" />
          <span className="vip-brand">Gate buddy</span>
          <span className="vip-crown">👑</span>
          <span className="vip-tag">| VIP</span>
        </div>
        <p className="vip-desc">VIP Experience world where everything is made simple, comfortable, just for you</p>
        <button className="btn-vip" onClick={() => requireAuth(() => navigate("/vip"))}>
          <VIPCrownIcon />
          VIP Experience
        </button>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const navigate = useNavigate();
  const services = [
    {
      imgClass: "svc-img-counters",
      title: "✈️ Counters",
      desc: "See our impact in numbers real-time stats that show how we help travelers move smarter.",
    },
    {
      imgClass: "svc-img-map",
      title: "🗺️ Map",
      desc: "Discover the airport effortlessly. Find gates, lounges, and facilities in real-time, navigate smoothly from check-in to boarding.",
    },
    {
      imgClass: "svc-img-financial",
      title: "📊 Financial Services",
      desc: "Access ATMs, currency exchange, and payment services quickly. Manage your travel expenses with ease and convenience throughout the airport.",
      path: "/financial",
    },
    {
      imgClass: "svc-img-dining",
      title: "🏛️ Shops & Dining",
      desc: "Discover all airport shops, cafes, and restaurants in one place. Navigate, explore, and enjoy your favorite spots effortlessly.",
    },
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-title-row">
          <StarIcon size={28} />
          <h2>Gate Buddy Services</h2>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              className="service-card"
              key={i}
              style={s.path ? { cursor: "pointer" } : {}}
              onClick={() => s.path && navigate(s.path)}
            >
              <div className={`service-img ${s.imgClass}`} />
              <div className="service-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Accessibility ─────────────────────────────────────────────────────────────
function Accessibility() {
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
  return (
    <section className="accessibility-section">
      <div className="access-overlay" />
      <div className="access-content">
        <h2>Accessibility &amp; Assistance ♿</h2>
        <p>Enjoy a smoother, more comfortable airport journey with our special assistance services shown on the map.</p>
        <button className="btn-access" onClick={() => requireAuth(() => navigate("/accessibility"))}>
          <WheelchairIcon />
          Accessibility
        </button>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const navigate = useNavigate(); // 👈 مهم جدًا

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          
          <div className="about-text">
            <div className="section-title-row">
              <span className="emoji-icon">💬</span>
              <h2 style={{ color: "#1a1a2e" }}>About Us</h2>
            </div>

            <p style={{ color: "#333333", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
              Discover how Gate Buddy transforms your airport experience with smart navigation,
              real-time updates, and personalized travel assistance.
            </p>

            <button 
              className="btn-primary"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>

          <div className="about-img-wrap">
            <img
              src="/images/111.jpeg"
              alt="Airport"
              className="about-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <PlaneIcon size={22} color="#F5A623" />
            <span>Gate Buddy</span>
          </div>
          <p>Your ultimate flight tracking and airport services companion.<br />Making travel easier, one flight at a time.</p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">Live Flight Board</a>
          <a href="#">Flight Tracking</a>
          <a href="#">Airport Services</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Live Chat</a>
          <a href="#">Report Issue</a>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
              <Link to="/faq">FAQ</Link>
          <a href="#">About Us</a>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Welcome />
      <Metrics />
      <SaveTimeBanner />
      <HowItWorks />
      <VIPBanner />
      <Services />
      <Accessibility />
      <About />
      <Footer />
    </div>
  );
}
