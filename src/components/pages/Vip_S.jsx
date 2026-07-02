import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const LoungeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h18v1z" />
  </svg>
);

const FoodIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const WifiIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
);

const SmokingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 9l1-1a4 4 0 0 0-4-4l-1 1" />
    <rect x="2" y="13" width="20" height="4" rx="1" />
    <line x1="18" y1="13" x2="18" y2="17" />
    <line x1="21" y1="13" x2="21" y2="17" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#EDB046" stroke="#EDB046" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const vipFeatures = [
  {
    id: 1,
    icon: <LoungeIcon />,
    title: "Private Lounge Access",
    desc: "Relax in our luxurious private lounge before your flight.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
  {
    id: 2,
    icon: <FoodIcon />,
    title: "Food & Beverage",
    desc: "Enjoy a wide variety of gourmet meals and beverages.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    id: 3,
    icon: <WifiIcon />,
    title: "Free Wi-Fi & Entertainment",
    desc: "Stay connected with high-speed internet and premium television zones.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
  {
    id: 4,
    icon: <SmokingIcon />,
    title: "Smoking & Non-Smoking Areas",
    desc: "Choose your comfort zone with designated areas for every preference.",
    image: "https://images.unsplash.com/photo-1544816565-bf03f37f7eb5?w=600&q=80",
  },
  {
    id: 5,
    icon: <MapPinIcon />,
    title: "Highlighted on Map",
    desc: "All VIP facilities are clearly marked on the airport map.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
  },
];

const perks = [
  "Priority boarding & check-in",
  "Complimentary luggage assistance",
  "Dedicated VIP concierge",
  "Exclusive spa & wellness area",
  "Business center access",
  "Limousine service on request",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function VipS() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) navigate("/login");
  }, [navigate]);

  if (!localStorage.getItem("auth_token")) return null;

  return (
    <div style={s.page}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={s.hero}>
        <img
          src="https://images.unsplash.com/photo-1540339832862-474599807836?w=1600&q=80"
          alt="VIP Experience"
          style={s.heroBg}
        />
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <h1 style={s.heroTitle}>VIP Experience</h1>
          <p style={s.heroSub}>
            Enjoy exclusive comfort and personalized airport services
            designed for your luxury travel.
          </p>
          <div style={s.heroStats}>
            {[["5★", "Rated Lounges"], ["24/7", "Concierge"], ["100+", "Services"]].map(([num, label]) => (
              <div key={label} style={s.statItem}>
                <span style={s.statNum}>{num}</span>
                <span style={s.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.sectionHead}>
            <span style={s.sectionEyebrow}>WHAT&apos;S INCLUDED</span>
            <h2 style={s.sectionTitle}>Premium Services</h2>
            <p style={s.sectionSub}>
              Every detail crafted for your ultimate airport comfort
            </p>
          </div>

          <div style={s.grid}>
            {vipFeatures.map((f) => (
              <div
                key={f.id}
                style={{
                  ...s.card,
                  boxShadow: hoveredCard === f.id
                    ? "0 8px 32px rgba(0,45,107,0.18)"
                    : "0 2px 16px rgba(0,45,107,0.08)",
                  transform: hoveredCard === f.id ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHoveredCard(f.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={s.cardImgWrap}>
                  <img src={f.image} alt={f.title} style={s.cardImg} />
                  <div style={s.cardImgOverlay} />
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardIconWrap}>{f.icon}</div>
                  <h3 style={s.cardTitle}>{f.title}</h3>
                  <p style={s.cardDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks Banner ── */}
      <section style={s.perksBanner}>
        <div style={s.container}>
          <div style={s.perksInner}>
            <div style={s.perksLeft}>
              <span style={s.sectionEyebrow}>EXCLUSIVE BENEFITS</span>
              <h2 style={{ ...s.sectionTitle, color: "white", marginBottom: "12px" }}>
                Everything You Deserve
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "28px" }}>
                Our VIP members enjoy a curated selection of services that transform
                every airport visit into an unforgettable luxury experience.
              </p>
              <div style={s.perksList}>
                {perks.map((p) => (
                  <div key={p} style={s.perkItem}>
                    <span style={s.perkCheck}><CheckIcon /></span>
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={s.perksRight}>
              <div style={s.perksImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
                  alt="VIP Lounge"
                  style={s.perksImg}
                />
                <div style={s.perksImgBadge}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>Luxury Rated</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>By 2,400+ travelers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>Ready for a Premium Experience?</h2>
          <p style={s.ctaSub}>
            Upgrade your journey and access world-class VIP lounges today.
          </p>
          <button style={s.ctaBtn} onClick={() => navigate("/map")}>Explore VIP Lounges</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
  },
  hero: {
    position: "relative",
    height: "520px",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(0,45,107,0.88) 0%, rgba(0,20,60,0.75) 60%, rgba(0,0,0,0.5) 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 32px",
    width: "100%",
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(237,176,70,0.18)",
    border: "1px solid rgba(237,176,70,0.5)",
    color: "#EDB046",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    padding: "6px 16px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  heroTitle: {
    color: "white",
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    margin: "0 0 16px",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "1.05rem",
    maxWidth: "480px",
    lineHeight: 1.6,
    margin: "0 0 36px",
  },
  heroStats: {
    display: "flex",
    gap: "40px",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  statNum: {
    color: "#EDB046",
    fontSize: "1.6rem",
    fontWeight: 800,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.78rem",
    letterSpacing: "0.05em",
  },
  section: {
    padding: "72px 0",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px",
  },
  sectionHead: {
    textAlign: "center",
    marginBottom: "52px",
  },
  sectionEyebrow: {
    display: "inline-block",
    color: "#EDB046",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    marginBottom: "10px",
  },
  sectionTitle: {
    color: "#002D6B",
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  sectionSub: {
    color: "#6B7280",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,45,107,0.08)",
    transition: "box-shadow 0.25s ease, transform 0.25s ease",
  },
  cardImgWrap: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardImgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,45,107,0.55) 0%, transparent 60%)",
  },
  cardTag: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "#EDB046",
    color: "#002D6B",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "12px",
    letterSpacing: "0.05em",
  },
  cardBody: {
    padding: "24px",
    border: "1.5px solid #EDB046",
    borderTop: "none",
    borderRadius: "0 0 16px 16px",
  },
  cardIconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "rgba(237,176,70,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    border: "1px solid rgba(237,176,70,0.25)",
  },
  cardTitle: {
    color: "#002D6B",
    fontSize: "1.05rem",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  cardDesc: {
    color: "#6B7280",
    fontSize: "0.85rem",
    lineHeight: 1.6,
    margin: "0 0 20px",
  },
  cardBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "#002D6B",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
  },
  perksBanner: {
    background: "linear-gradient(135deg, #002D6B 0%, #001a42 100%)",
    padding: "80px 0",
  },
  perksInner: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },
  perksLeft: {},
  perksList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 24px",
  },
  perkItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  perkCheck: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  perksRight: {},
  perksImgWrap: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
  },
  perksImg: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block",
  },
  perksImgBadge: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    background: "rgba(0,45,107,0.85)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    padding: "14px 18px",
    border: "1px solid rgba(237,176,70,0.3)",
  },
  cta: {
    background: "#F0F3F8",
    padding: "72px 24px",
    textAlign: "center",
  },
  ctaInner: {
    maxWidth: "580px",
    margin: "0 auto",
  },
  ctaTitle: {
    color: "#002D6B",
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    fontWeight: 800,
    margin: "0 0 14px",
  },
  ctaSub: {
    color: "#6B7280",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    marginBottom: "32px",
  },
  ctaBtn: {
    background: "linear-gradient(135deg, #EDB046 0%, #d4943a 100%)",
    color: "#002D6B",
    border: "none",
    padding: "15px 44px",
    borderRadius: "50px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px rgba(237,176,70,0.35)",
    letterSpacing: "0.02em",
  },
};
