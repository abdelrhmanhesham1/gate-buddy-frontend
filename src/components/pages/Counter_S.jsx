import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { servicesAPI } from "../../../utils/Api.js";
import { useLang } from "../../context/LanguageContext.jsx";

// Regional/European carriers → "Domestic" tab; everything else → "International".
// (The service model has no domestic/intl flag, so we split by carrier region.)
const REGIONAL_CARRIERS = [
  "KLM", "Transavia", "easyJet", "Ryanair", "Vueling", "Air France", "Lufthansa",
  "Swiss", "British Airways", "Aer Lingus", "Wizz", "Eurowings", "Brussels",
  "SAS", "Finnair", "TAP", "Iberia", "Austrian", "ITA", "Norwegian",
];
const isRegional = (airline = "") =>
  REGIONAL_CARRIERS.some((c) => airline.toLowerCase().includes(c.toLowerCase()));

// Map a live COUNTERS service into the card shape this page already renders.
function mapCounter(s) {
  const airline =
    s.airline || s.name.replace(/\s*Check-?in.*$/i, "").replace(/\s*\(.*$/, "").trim();
  return {
    id: (s._id || "").slice(-4).toUpperCase() || s.name.slice(0, 3),
    airline,
    terminal: s.terminal || "—",
    zone: s.zone || s.gate || "—",
    status: s.status === "Open" ? "Open" : s.status === "Busy" ? "Open" : "Closed",
    waitTime: s.waitTime ? `~${s.waitTime} min` : "—",
    logo: s.airlineLogo || null,
    gates: s.gates && s.gates.length ? s.gates : s.gate ? [s.gate] : [],
    services: s.services && s.services.length ? s.services : s.amenities || [],
    bookingUrl: `https://www.google.com/search?q=${encodeURIComponent(airline + " book flight")}`,
  };
}

const AIRLINE_COLORS = {
  EgyptAir: "#006DB7",
  "Qatar Airways": "#5C0632",
  Emirates: "#C8102E",
  "Turkish Airlines": "#E81932",
  Lufthansa: "#05164D",
  "Nile Air": "#FF8C00",
  "Air Arabia Egypt": "#FF0000",
  "Fly Egypt": "#1B3A6B",
};

const AIRLINE_INITIALS = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const AIRLINE_SVG_LOGOS = {
  EgyptAir: (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#006DB7"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">EA</text>
    </svg>
  ),
  "Nile Air": (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#FF6B00"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">NA</text>
    </svg>
  ),
  "Air Arabia Egypt": (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#CC0000"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">AA</text>
    </svg>
  ),
  "Fly Egypt": (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#1B3A6B"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">FE</text>
    </svg>
  ),
  "Qatar Airways": (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#5C0632"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">QA</text>
    </svg>
  ),
  Emirates: (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#C8102E"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">EK</text>
    </svg>
  ),
  "Turkish Airlines": (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#C8102E"/>
      <circle cx="22" cy="22" r="10" fill="white" opacity="0.15"/>
      <text x="22" y="28" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">TK</text>
    </svg>
  ),
  Lufthansa: (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="10" fill="#05164D"/>
      <circle cx="22" cy="18" r="7" fill="#F5A623" opacity="0.9"/>
      <text x="22" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Arial">LH</text>
    </svg>
  ),
};

function AirlineLogo({ airline, logo }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (logo && !imgFailed) {
    return (
      <img
        src={logo}
        alt={airline}
        style={{
          width: 44, height: 44, borderRadius: "10px", objectFit: "contain",
          background: "#ffffff", border: "1.5px solid #e0e8ff", padding: 4,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  const svgLogo = AIRLINE_SVG_LOGOS[airline];
  if (svgLogo) {
    return (
      <div style={{ width: 44, height: 44, flexShrink: 0 }}>
        {svgLogo}
      </div>
    );
  }

  const color = AIRLINE_COLORS[airline] || "#002D6B";
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "10px", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 800, fontSize: "0.85rem",
      letterSpacing: "0.5px", flexShrink: 0,
    }}>
      {AIRLINE_INITIALS(airline)}
    </div>
  );
}

function CounterCard({ counter }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const isOpen = counter.status === "Open";

  return (
    <div className="cs-card">
      <div className="cs-card-bar" style={{ background: "#002D6B" }} />
      <div className="cs-card-header">
        <div className="cs-airline-row">
          <AirlineLogo airline={counter.airline} logo={counter.logo} />
          <div>
            <div className="cs-counter-id">Counter {counter.id}</div>
            <div className="cs-airline-name">{counter.airline}</div>
          </div>
        </div>
        <span className={`cs-badge ${isOpen ? "cs-badge-open" : "cs-badge-closed"}`}>
          {isOpen ? "● Open" : "○ Closed"}
        </span>
      </div>
      <div className="cs-card-body">
        <div className="cs-info-row">
          <span className="cs-info-icon">📍</span>
          <span>{counter.terminal} · {counter.zone}</span>
        </div>
        <div className="cs-info-row">
          <span className="cs-info-icon">🚪</span>
          <span>Gates: {counter.gates.join(", ")}</span>
        </div>
      </div>
      <div className="cs-services">
        {counter.services.map((s) => (
          <span key={s} className="cs-service-tag">{s}</span>
        ))}
      </div>
      <div className="cs-card-footer">
        <button className="cs-map-btn" onClick={() => navigate("/map")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#EDB046" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
          {t("common.showOnMap")}
        </button>
        <a
          href={counter.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cs-book-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#002D6B" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
          {t("common.bookNow")}
        </a>
      </div>
    </div>
  );
}

export default function CounterS() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("domestic");
  const [search, setSearch] = useState("");
  const [domestic, setDomestic] = useState([]);
  const [international, setInternational] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    servicesAPI
      .getAll("COUNTERS")
      .then((res) => {
        if (!alive) return;
        const mapped = (res.data?.data?.services || []).map(mapCounter);
        setDomestic(mapped.filter((c) => isRegional(c.airline)));
        setInternational(mapped.filter((c) => !isRegional(c.airline)));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const allCounters = activeTab === "domestic" ? domestic : international;
  const filtered = allCounters.filter((c) =>
    c.airline.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.terminal.toLowerCase().includes(search.toLowerCase()) ||
    c.zone.toLowerCase().includes(search.toLowerCase())
  );
  const openCount = filtered.filter((c) => c.status === "Open").length;
  const closedCount = filtered.filter((c) => c.status === "Closed").length;

  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .cs-back-btn { position: absolute; top: 18px; left: 24px; z-index: 10; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); border: 1.5px solid rgba(255,255,255,0.35); color: white; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; transition: background 0.2s; }
        .cs-back-btn:hover { background: rgba(255,255,255,0.28); }
        .cs-page { font-family: 'Plus Jakarta Sans', sans-serif; background: #ffffff; min-height: 100vh; display: flex; flex-direction: column; }
        .cs-hero { position: relative; height: 300px; overflow: hidden; }
        .cs-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 60%; filter: brightness(0.45); }
        .cs-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,45,107,0.4) 40%, rgba(0,45,107,0.85) 60%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
        .cs-hero-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #EDB046; background: rgba(237,176,70,0.15); border: 1px solid rgba(237,176,70,0.4); padding: 4px 14px; border-radius: 999px; }
        .cs-hero h1 { margin: 0; color: white; font-size: 2.4rem; font-weight: 800; letter-spacing: -0.5px; text-align: center; }
        .cs-hero p { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        .cs-main { flex: 1; max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 24px 64px; }
        .cs-stats-bar { display: flex; gap: 16px; margin: -28px 0 32px; position: relative; z-index: 10; flex-wrap: wrap; }
        .cs-stat-card { background: white; border-radius: 14px; padding: 16px 28px; box-shadow: 0 4px 20px rgba(0,45,107,0.08); border: 1.5px solid #EDB046; display: flex; align-items: center; gap: 14px; flex: 1; min-width: 150px; }
        .cs-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .cs-stat-num { font-size: 1.6rem; font-weight: 800; color: #002D6B; line-height: 1; }
        .cs-stat-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; margin-top: 2px; }
        .cs-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 28px; }
        .cs-tabs { display: flex; background: white; border-radius: 12px; padding: 4px; box-shadow: 0 2px 8px rgba(0,45,107,0.08); border: 1.5px solid #EDB046; gap: 4px; }
        .cs-tab { padding: 10px 28px; border-radius: 9px; border: none; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; background: transparent; color: #6b7280; }
        .cs-tab.active { background: #002D6B; color: white; box-shadow: 0 2px 10px rgba(0,45,107,0.25); }
        .cs-tab:not(.active):hover { background: #f0f4fa; color: #002D6B; }
        .cs-search-wrap { position: relative; flex: 1; max-width: 320px; }
        .cs-search-wrap input { width: 100%; padding: 10px 16px 10px 42px; border: 1.5px solid #EDB046; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: white; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .cs-search-wrap input:focus { border-color: #002D6B; }
        .cs-search-wrap input::placeholder { color: #9ca3af; }
        .cs-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 1rem; }
        .cs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .cs-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,45,107,0.06); border: 1.5px solid #EDB046; border-top: none; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
        .cs-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,45,107,0.12); }
        .cs-card-bar { height: 12px; width: 100%; border-radius: 18px 18px 0 0; }
        .cs-card-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px 12px; gap: 12px; }
        .cs-airline-row { display: flex; align-items: center; gap: 12px; }
        .cs-counter-id { font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
        .cs-airline-name { font-size: 1rem; font-weight: 700; color: #002D6B; }
        .cs-badge { padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
        .cs-badge-open { background: #dcfce7; color: #15803d; }
        .cs-badge-closed { background: #fee2e2; color: #b91c1c; }
        .cs-card-body { padding: 0 20px 14px; display: flex; flex-direction: column; gap: 7px; }
        .cs-info-row { display: flex; align-items: center; gap: 8px; font-size: 0.83rem; color: #4b5563; }
        .cs-info-icon { font-size: 0.9rem; }
        .cs-services { padding: 0 20px 16px; display: flex; flex-wrap: wrap; gap: 6px; }
        .cs-service-tag { font-size: 0.7rem; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe; }
        .cs-card-footer { display: flex; gap: 10px; padding: 14px 20px 20px; border-top: 1px solid #f1f5f9; margin-top: auto; }
        .cs-map-btn { flex: 1; padding: 10px 16px; background: #002D6B; color: #EDB046; border: none; border-radius: 9px; font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, opacity 0.2s; }
        .cs-map-btn:hover { background: #001f4d; opacity: 0.92; }
        .cs-book-btn { flex: 1; padding: 10px 16px; background: #EDB046; color: #002D6B; border: none; border-radius: 9px; font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, opacity 0.2s; text-decoration: none; }
        .cs-book-btn:hover { background: #d4972f; opacity: 0.92; }
        .cs-empty { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #6b7280; }
        .cs-empty-icon { font-size: 3rem; margin-bottom: 12px; }
        .cs-empty h3 { margin: 0 0 6px; color: #374151; }
        .cs-section-title { font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 16px; }
        @media (max-width: 640px) {
          .cs-hero h1 { font-size: 1.7rem; }
          .cs-controls { flex-direction: column; align-items: stretch; }
          .cs-search-wrap { max-width: 100%; }
          .cs-stats-bar { gap: 10px; }
          .cs-stat-card { padding: 14px 18px; }
        }
      `}</style>

      <div className="cs-page">
        <Navbar />

        <div className="cs-hero">
          <img src="/images/counters.jpeg" alt="Airport counters" />
          <button className="cs-back-btn" onClick={() => navigate("/home")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <div className="cs-hero-overlay">
            <h1>{t("cs.title")}</h1>
            <p>{t("cs.sub")}</p>
          </div>
        </div>

        <div className="cs-main">
          <div className="cs-stats-bar">
            <div className="cs-stat-card">
              <div className="cs-stat-icon" style={{ background: "#dbeafe" }}>🏢</div>
              <div>
                <div className="cs-stat-num">{allCounters.length}</div>
                <div className="cs-stat-label">{t("cs.total")}</div>
              </div>
            </div>
            <div className="cs-stat-card">
              <div className="cs-stat-icon" style={{ background: "#dcfce7" }}>✅</div>
              <div>
                <div className="cs-stat-num" style={{ color: "#16a34a" }}>{allCounters.filter((c) => c.status === "Open").length}</div>
                <div className="cs-stat-label">{t("cs.currentlyOpen")}</div>
              </div>
            </div>
            <div className="cs-stat-card">
              <div className="cs-stat-icon" style={{ background: "#fee2e2" }}>🔴</div>
              <div>
                <div className="cs-stat-num" style={{ color: "#dc2626" }}>{allCounters.filter((c) => c.status === "Closed").length}</div>
                <div className="cs-stat-label">{t("cs.closed")}</div>
              </div>
            </div>
          </div>

          <div className="cs-controls">
            <div className="cs-tabs">
              <button className={`cs-tab ${activeTab === "domestic" ? "active" : ""}`}
                onClick={() => { setActiveTab("domestic"); setSearch(""); }}>
                ✈ {t("cs.domestic")}
              </button>
              <button className={`cs-tab ${activeTab === "international" ? "active" : ""}`}
                onClick={() => { setActiveTab("international"); setSearch(""); }}>
                🌍 {t("cs.intl")}
              </button>
            </div>
            <div className="cs-search-wrap">
              <span className="cs-search-icon">🔍</span>
              <input
                type="text"
                placeholder={t("cs.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="cs-section-title">
            {filtered.length} counter{filtered.length !== 1 ? "s" : ""} found
            &nbsp;·&nbsp;<span style={{ color: "#16a34a" }}>{openCount} open</span>
            &nbsp;·&nbsp;<span style={{ color: "#dc2626" }}>{closedCount} closed</span>
          </div>

          <div className="cs-grid">
            {loading ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">⏳</div>
                <h3>{t("cs.loading")}</h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">🔍</div>
                <h3>{t("cs.noCounters")}</h3>
                <p>{t("cs.tryDifferent")}</p>
              </div>
            ) : (
              filtered.map((counter) => <CounterCard key={counter.id} counter={counter} />)
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
