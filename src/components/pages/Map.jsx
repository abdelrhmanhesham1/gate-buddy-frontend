import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { openApk } from "../../config.js";
import { useLang } from "../../context/LanguageContext.jsx";

// ── Colors ────────────────────────────────────────────────────────────────────
const PRIMARY = "#002D6B";
const SECONDARY = "#EDB046";

// ── Icons ─────────────────────────────────────────────────────────────────────
const MapPinIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill={SECONDARY} stroke={SECONDARY} strokeWidth="1.5" />
    <circle cx="12" cy="10" r="3" fill="white" />
  </svg>
);

const LockIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="11" width="16" height="11" rx="3" fill={SECONDARY} />
    <path d="M7 11V7.5a5 5 0 0 1 10 0V11" stroke={SECONDARY} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="12" cy="17" r="2" fill={PRIMARY} />
    <rect cx="12" y="18" width="2" height="2" fill={PRIMARY} />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SECONDARY} strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TerminalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={SECONDARY}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const NavigationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill={SECONDARY} />
    <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke={SECONDARY} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={SECONDARY}>
    <rect x="9" y="0" width="6" height="6" rx="3" />
    <path d="M3 9h18M9 9l-2 12M15 9l2 12M7 15h10" stroke={SECONDARY} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShopsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SECONDARY} strokeWidth="2">
    <path d="M3 9l1-6h16l1 6" />
    <path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
    <path d="M9 9v3a3 3 0 0 0 6 0V9" />
  </svg>
);

// ── Fake Map Background ───────────────────────────────────────────────────────
function FakeMapBackground() {
  return (
    <div style={styles.mapBg}>
      {/* Dark map-like SVG matching Figma */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Base dark background */}
        <rect width="1000" height="320" fill="#7a9cbf" />

        {/* Grid */}
        {[...Array(20)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 17} x2="1000" y2={i * 17} stroke="#6b8faf" strokeWidth="0.8" />
        ))}
        {[...Array(40)].map((_, i) => (
          <line key={`v${i}`} x1={i * 26} y1="0" x2={i * 26} y2="320" stroke="#6b8faf" strokeWidth="0.8" />
        ))}

        {/* Roads - horizontal */}
        <rect x="0" y="120" width="1000" height="14" fill="#8fb3d0" />
        <rect x="0" y="190" width="1000" height="14" fill="#8fb3d0" />

        {/* Roads - vertical */}
        <rect x="180" y="0" width="14" height="320" fill="#8fb3d0" />
        <rect x="380" y="0" width="14" height="320" fill="#8fb3d0" />
        <rect x="580" y="0" width="14" height="320" fill="#8fb3d0" />
        <rect x="780" y="0" width="14" height="320" fill="#8fb3d0" />

        {/* Buildings / blocks */}
        <rect x="20" y="20" width="140" height="88" rx="4" fill="#6a8fae" />
        <rect x="20" y="136" width="140" height="42" rx="4" fill="#6a8fae" />
        <rect x="20" y="206" width="140" height="94" rx="4" fill="#6a8fae" />

        <rect x="210" y="20" width="150" height="50" rx="4" fill="#5f84a5" />
        <rect x="210" y="84" width="150" height="24" rx="4" fill="#6a8fae" />
        <rect x="210" y="136" width="80" height="42" rx="4" fill="#6a8fae" />
        <rect x="302" y="136" width="58" height="42" rx="4" fill="#5f84a5" />
        <rect x="210" y="206" width="150" height="60" rx="4" fill="#6a8fae" />
        <rect x="210" y="278" width="150" height="32" rx="4" fill="#5f84a5" />

        <rect x="410" y="20" width="150" height="40" rx="4" fill="#6a8fae" />
        <rect x="410" y="72" width="70" height="36" rx="4" fill="#5f84a5" />
        <rect x="492" y="72" width="68" height="36" rx="4" fill="#6a8fae" />
        <rect x="410" y="136" width="150" height="42" rx="4" fill="#5f84a5" />
        <rect x="410" y="206" width="70" height="94" rx="4" fill="#6a8fae" />
        <rect x="492" y="206" width="68" height="94" rx="4" fill="#5f84a5" />

        <rect x="610" y="20" width="150" height="88" rx="4" fill="#6a8fae" />
        <rect x="610" y="136" width="68" height="42" rx="4" fill="#5f84a5" />
        <rect x="690" y="136" width="70" height="42" rx="4" fill="#6a8fae" />
        <rect x="610" y="206" width="150" height="56" rx="4" fill="#5f84a5" />
        <rect x="610" y="274" width="150" height="36" rx="4" fill="#6a8fae" />

        <rect x="810" y="20" width="170" height="60" rx="4" fill="#6a8fae" />
        <rect x="810" y="92" width="170" height="16" rx="4" fill="#5f84a5" />
        <rect x="810" y="136" width="80" height="42" rx="4" fill="#6a8fae" />
        <rect x="902" y="136" width="78" height="42" rx="4" fill="#5f84a5" />
        <rect x="810" y="206" width="170" height="94" rx="4" fill="#6a8fae" />

        {/* Slight dark overlay */}
        <rect width="1000" height="320" fill="rgba(0,30,70,0.18)" />
      </svg>


      {/* Lock overlay */}
      <div style={styles.lockOverlay}>
        <div style={styles.lockBox}>
          <LockIcon />
          <span style={styles.lockText}>App</span>
          <span style={styles.lockText}>Only</span>
        </div>
      </div>
    </div>
  );
}

// ── Feature Tags ──────────────────────────────────────────────────────────────
function FeatureTag({ icon, label }) {
  return (
    <div style={styles.featureTag}>
      {icon}
      <span style={styles.featureTagText}>{label}</span>
    </div>
  );
}

// ── Map Page ──────────────────────────────────────────────────────────────────
export default function Map() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ── Map Section ── */}
      <section style={styles.mapSection}>
        <FakeMapBackground />
      </section>

      {/* ── Info Card ── */}
      <section style={styles.infoSection}>
        <div style={styles.container}>

          {/* Pin icon */}
          <div style={styles.pinWrap}>
            <MapPinIcon />
          </div>

          {/* Title */}
          <h1 style={styles.title}>{t("map.title")}</h1>
          <p style={styles.subtitle}>{t("map.subtitle")}</p>

          {/* Description */}
          <p style={styles.desc}>
            {t("map.desc")}
          </p>

          {/* Feature Tags */}
          <div style={styles.featuresRow}>
            <FeatureTag icon={<TerminalIcon />} label="Interactive Terminal Map" />
            <FeatureTag icon={<NavigationIcon />} label="Real-time Gate Navigation" />
            <FeatureTag icon={<AccessibilityIcon />} label="Accessibility Routes" />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FeatureTag icon={<ShopsIcon />} label="Shops & Dining Locator" />
          </div>

          {/* Download CTA */}
          <p style={styles.downloadLabel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke={PRIMARY} strokeWidth="3"/></svg>
            {t("map.download")}
          </p>

          {/* Buttons */}
          <div style={styles.buttonsRow}>
            <button style={styles.btnDownload} onClick={openApk}>
              <DownloadIcon />
              {t("map.downloadApp")}
            </button>
            <button style={styles.btnBack} onClick={() => navigate("/home")}>
              <HomeIcon />
              {t("map.backHome")}
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    background: "#f0f4f8",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  // Map section
  mapSection: {
    width: "100%",
    height: "320px",
    position: "relative",
    overflow: "hidden",
  },
  mapBg: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  mapLabelsRow: {
    position: "absolute",
    bottom: "0px",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    gap: "22px",
    zIndex: 2,
    background: "rgba(176,200,225,0.85)",
    padding: "6px 0",
  },
  mapLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#3a5a7a",
    letterSpacing: "1px",
  },
  lockOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    paddingBottom: "30px",
  },
  lockBox: {
    background: PRIMARY,
    border: `2.5px solid ${SECONDARY}`,
    borderRadius: "20px",
    padding: "22px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  },
  lockText: {
    color: "white",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "1.3",
  },
  // Info section
  infoSection: {
    padding: "0 0 0px",
    background: "white",
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "32px 24px 32px",
    textAlign: "center",
  },
  pinWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: PRIMARY,
    margin: "0 0 4px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  subtitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: SECONDARY,
    margin: "0 0 14px",
  },
  desc: {
    fontSize: "13.5px",
    color: "#666",
    lineHeight: "1.75",
    margin: "0 auto 22px",
    maxWidth: "520px",
  },
  featuresRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  featureTag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: `1.5px solid ${SECONDARY}`,
    borderRadius: "20px",
    padding: "6px 14px",
    background: "white",
    cursor: "default",
  },
  featureTagText: {
    fontSize: "12.5px",
    fontWeight: "500",
    color: "#333",
  },
  downloadLabel: {
    fontSize: "15px",
    fontWeight: "600",
    color: PRIMARY,
    margin: "24px 0 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  buttonsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  btnDownload: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: PRIMARY,
    color: "#EDB046",
    border: "none",
    borderRadius: "8px",
    padding: "11px 26px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnBack: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "white",
    color: PRIMARY,
    border: `2px solid ${SECONDARY}`,
    borderRadius: "8px",
    padding: "11px 26px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
