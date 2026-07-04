import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { servicesAPI } from "../../../utils/Api.js";
import { useLang } from "../../context/LanguageContext.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const WheelchairIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <path d="M10 8H8l-2 8h10l-1-5H10V8z" />
    <path d="M8 16l-1 4" />
    <path d="M16 16l1 4" />
    <circle cx="8" cy="21" r="1" />
    <circle cx="16" cy="21" r="1" />
  </svg>
);

const RestroomIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="4" r="2" />
    <circle cx="15" cy="4" r="2" />
    <path d="M6 8h4l1 8H7L6 8z" />
    <path d="M14 8h4l-1 8h-4l1-8z" />
    <line x1="7" y1="16" x2="7" y2="21" />
    <line x1="11" y1="16" x2="11" y2="21" />
    <line x1="15" y1="16" x2="15" y2="21" />
    <line x1="17" y1="16" x2="17" y2="21" />
  </svg>
);

const GolfCartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17h18" />
    <path d="M5 17V9l4-5h8l2 5v3H5z" />
    <circle cx="7" cy="19" r="2" />
    <circle cx="17" cy="19" r="2" />
    <path d="M9 4v5" />
  </svg>
);

const LuggageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="7" width="12" height="14" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const EscortIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const services = [
  {
    id: 1,
    icon: <WheelchairIcon />,
    title: "Wheelchair Service",
    desc: "Request wheelchair support from arrival to boarding gate. Our trained staff ensures a smooth, comfortable journey across the terminal.",
    image: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=600&q=80",
  },
  {
    id: 2,
    icon: <RestroomIcon />,
    title: "Accessible Restrooms",
    desc: "Easily find restrooms designed for accessibility and comfort, equipped with all necessary facilities throughout the terminal.",
    image: "https://images.unsplash.com/photo-1583845112203-29329902332e?w=600&q=80",
  },
  {
    id: 3,
    icon: <GolfCartIcon />,
    title: "Golf Car Service",
    desc: "Enjoy comfortable rides inside the terminal with our golf car service — perfect for long distances or limited mobility.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
  {
    id: 4,
    icon: <LuggageIcon />,
    title: "Luggage Assistance",
    desc: "Get help carrying and handling your luggage at any point in the terminal. Let us take the weight off your shoulders.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  },
  {
    id: 5,
    icon: <EscortIcon />,
    title: "Escort Service",
    desc: "Personal escort through check-in, security, and boarding. Our dedicated staff stays with you every step of the way.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
];

const commitments = [
  "Trained accessibility staff available 24/7",
  "Barrier-free pathways throughout terminal",
  "Priority boarding for passengers with needs",
  "Sign language assistance on request",
  "Visual & audio announcements system",
  "Dedicated accessibility help desks",
];

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#ffffff", minHeight: "100vh" },
  hero: { position: "relative", height: "90vh", overflow: "hidden", display: "flex", alignItems: "center" },
  heroImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,45,107,0.88) 0%, rgba(0,45,107,0.55) 60%, rgba(0,0,0,0.2) 100%)" },
  heroContent: { position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", padding: "0 32px" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(237,176,70,0.18)", border: "1px solid rgba(237,176,70,0.5)", color: "#EDB046", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", padding: "5px 14px", borderRadius: "20px", marginBottom: "18px", textTransform: "uppercase" },
  heroTitle: { color: "white", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 14px", lineHeight: 1.2, letterSpacing: "-0.02em" },
  heroTitleAccent: { color: "#EDB046" },
  heroSub: { color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "520px", margin: 0 },
  statsBar: { background: "#002D6B" },
  statsInner: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "stretch" },
  statItem: { flex: 1, textAlign: "center", padding: "22px 16px" },
  statNum: { color: "#EDB046", fontSize: "1.7rem", fontWeight: 800, display: "block", lineHeight: 1, marginBottom: "4px" },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.04em" },
  section: { padding: "72px 0" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px" },
  sectionHead: { textAlign: "center", marginBottom: "52px" },
  eyebrow: { display: "inline-block", color: "#EDB046", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "10px", textTransform: "uppercase" },
  sectionTitle: { color: "#002D6B", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" },
  sectionSub: { color: "#6B7280", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "28px" },
  card: { background: "white", borderRadius: "18px", overflow: "hidden", boxShadow: "0 2px 20px rgba(0,45,107,0.07)", border: "none", transition: "box-shadow 0.25s ease, transform 0.25s ease", cursor: "default", display: "flex", flexDirection: "column" },
  cardImgWrap: { position: "relative", height: "190px", flexShrink: 0, overflow: "hidden" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" },
  cardOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,45,107,0.6) 0%, transparent 55%)" },
  cardTag: { position: "absolute", top: "12px", right: "12px", background: "#EDB046", color: "#002D6B", fontSize: "0.65rem", fontWeight: 700, padding: "4px 11px", borderRadius: "10px", letterSpacing: "0.05em", textTransform: "uppercase" },
  cardBody: { padding: "22px 24px 24px", border: "1.5px solid #EDB046", borderTop: "none", borderRadius: "0 0 18px 18px", flex: 1 },
  cardIconWrap: { width: "50px", height: "50px", borderRadius: "12px", background: "rgba(237,176,70,0.10)", border: "1px solid rgba(237,176,70,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" },
  cardTitle: { color: "#002D6B", fontSize: "1.02rem", fontWeight: 700, margin: "0 0 8px" },
  cardDesc: { color: "#6B7280", fontSize: "0.84rem", lineHeight: 1.65, margin: "0 0 18px" },
  cardBtn: { display: "inline-flex", alignItems: "center", gap: "7px", background: "#002D6B", color: "#EDB046", border: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s ease" },
  commitBanner: { background: "linear-gradient(135deg, #002D6B 0%, #001a42 100%)", padding: "80px 0" },
  commitInner: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" },
  commitEyebrow: { display: "inline-block", color: "#EDB046", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "14px", textTransform: "uppercase" },
  commitTitle: { color: "white", fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 800, margin: "0 0 14px", lineHeight: 1.25, letterSpacing: "-0.02em" },
  commitSub: { color: "rgba(255,255,255,0.7)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "32px" },
  commitList: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" },
  commitItem: { display: "flex", alignItems: "flex-start", gap: "10px", color: "rgba(255,255,255,0.85)", fontSize: "0.84rem", lineHeight: 1.5 },
  commitCheck: { flexShrink: 0, marginTop: "2px" },
  commitImgWrap: { position: "relative", borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" },
  commitImg: { width: "100%", height: "370px", objectFit: "cover", display: "block" },
  commitBadge: { position: "absolute", bottom: "20px", left: "20px", background: "rgba(0,45,107,0.85)", backdropFilter: "blur(8px)", borderRadius: "12px", padding: "14px 18px", border: "1px solid rgba(237,176,70,0.3)" },
  commitBadgeNum: { color: "#EDB046", fontSize: "1.5rem", fontWeight: 800, display: "block", lineHeight: 1 },
  commitBadgeText: { color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginTop: "4px" },
  cta: { background: "#EEF3FA", padding: "72px 24px", textAlign: "center" },
  ctaInner: { maxWidth: "560px", margin: "0 auto" },
  ctaTitle: { color: "#002D6B", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.02em" },
  ctaSub: { color: "#6B7280", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px" },
  ctaBtn: { background: "linear-gradient(135deg, #EDB046 0%, #d4943a 100%)", color: "#002D6B", border: "none", padding: "14px 44px", borderRadius: "50px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(237,176,70,0.35)", letterSpacing: "0.02em" },
};

const A11Y_ICONS = [<WheelchairIcon />, <RestroomIcon />, <GolfCartIcon />, <LuggageIcon />, <EscortIcon />];

// ── Component ──────────────────────────────────────────────────────────────────
export default function AccessabillityS() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    servicesAPI
      .getAll("ACCESSIBILITY")
      .then((res) => {
        if (!alive) return;
        const mapped = (res.data?.data?.services || []).map((s, i) => ({
          id: s._id || i,
          icon: A11Y_ICONS[i % A11Y_ICONS.length],
          title: s.name,
          desc: s.description || (s.amenities || []).join(" · "),
          image: (s.images && s.images[0]) ||
            "https://images.unsplash.com/photo-1559386484-97dfc0e15539?auto=format&w=800",
        }));
        setItems(mapped);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Real accessibility services when available, otherwise the static cards.
  const cards = items.length ? items : services;

  return (
    <div style={S.page}>
      <Navbar />

      {/* Hero */}
      <section style={S.hero}>
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"
          alt="Accessibility at airport"
          style={S.heroImg}
        />
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          
          <h1 style={S.heroTitle}>
            {t("acc.heroTitle")}
          </h1>
          <p style={S.heroSub}>
            {t("acc.heroSub")}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.sectionHead}>
            <span style={S.eyebrow}>{t("acc.ourServices")}</span>
            <h2 style={S.sectionTitle}>{t("acc.servicesTitle")}</h2>
            <p style={S.sectionSub}>
              {t("acc.servicesSub")}
            </p>
          </div>
          <div style={S.grid}>
            {cards.map((svc) => (
              <div
                key={svc.id}
                style={S.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,45,107,0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,45,107,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <div style={S.cardImgWrap}>
                  <img
                    src={svc.image}
                    alt={svc.title}
                    style={S.cardImg}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1559386484-97dfc0e15539?auto=format&w=800"; }}
                  />
                  <div style={S.cardOverlay} />
                </div>
                <div style={S.cardBody}>
                  <div style={S.cardIconWrap}>{svc.icon}</div>
                  <h3 style={S.cardTitle}>{svc.title}</h3>
                  <p style={S.cardDesc}>{svc.desc}</p>
                  <button
                    style={S.cardBtn}
                    onClick={() => navigate("/map")}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#EDB046")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#002D6B")}
                  >
                    <MapPinIcon />
                    {t("common.locateOnMap")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Banner */}
      <section style={S.commitBanner}>
        <div style={S.container}>
          <div style={S.commitInner}>
            <div>
              <span style={S.commitEyebrow}>{t("acc.ourPromise")}</span>
              <h2 style={S.commitTitle}>{t("acc.commitTitle")}</h2>
              <p style={S.commitSub}>
                {t("acc.commitSub")}
              </p>
              <div style={S.commitList}>
                {commitments.map((c, i) => (
                  <div key={i} style={S.commitItem}>
                    <span style={S.commitCheck}><CheckIcon /></span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={S.commitImgWrap}>
                <img src="https://images.unsplash.com/photo-1559386484-97dfc0e15539?w=800&q=80" alt="Accessibility support" style={S.commitImg} />
                <div style={S.commitBadge}>
                  <span style={S.commitBadgeNum}>100%</span>
                  <div style={S.commitBadgeText}>Dedicated to Accessibility</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <div style={S.ctaInner}>
          <span style={S.eyebrow}>{t("acc.needHelp")}</span>
          <h2 style={S.ctaTitle}>{t("acc.ctaTitle")}</h2>
          <p style={S.ctaSub}>
            {t("acc.ctaSub")}
          </p>
          <button
            style={S.ctaBtn}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            onClick={() => navigate("/chatbot")}
          >
            {t("acc.requestAssistance")}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
