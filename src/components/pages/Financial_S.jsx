import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { servicesAPI } from "../../../utils/Api.js";

// ── Live FINANCIAL services → the three card shapes this page renders ──────────
// Classify by the service's subCategory (ATMs / Currency Exchange / Banks / …),
// falling back to a name heuristic when subCategory is absent. The service schema
// has no fee/rate/commission columns (see PLAN.md §10), so those slots use the
// record's real amenities / opening hours instead.
const isATM = (n = "") => /atm|cash/i.test(n);
const isExchange = (n = "") => /travelex|gwk|exchange|forex|bureau|currency/i.test(n);
const isOpen = (s) => s === "Open" || s === "Busy";

function classify(s) {
  const sub = (s.subCategory || "").toLowerCase();
  if (sub) {
    if (sub.includes("atm") || sub.includes("cash")) return "atms";
    if (sub.includes("exchange") || sub.includes("currency") || sub.includes("forex")) return "currency";
    return "banks"; // Banks, Insurance, anything else
  }
  if (isATM(s.name)) return "atms";
  if (isExchange(s.name)) return "currency";
  return "banks";
}

function mapFinancial(services) {
  const atms = [], banks = [], currency = [];
  (services || []).forEach((s) => {
    const id = (s._id || "").slice(-4).toUpperCase();
    const base = { id, name: s.name, terminal: s.terminal || "—", location: s.zone || s.terminal || "—", open: isOpen(s.status) };
    const bucket = classify(s);
    if (bucket === "atms") {
      atms.push({ ...base, status: s.status === "Open" ? "Available" : "Busy", fee: "—", accepts: s.amenities || [] });
    } else if (bucket === "currency") {
      currency.push({ ...base, status: s.status, rate: "Live rates at desk", commission: (s.amenities || []).join(" · ") || "—" });
    } else {
      banks.push({ ...base, status: s.status, hours: s.operatingHours || "—", services: (s.services && s.services.length ? s.services : s.amenities) || [] });
    }
  });
  return { atms, banks, currency };
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#EDB046">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const PlaneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

// ── Card Components ───────────────────────────────────────────────────────────
function ATMCard({ item }) {
  const navigate = useNavigate();
  const isAvail = item.status === "Available";
  return (
    <div className="fs-card">
      <div className="fs-card-bar" />
      <div className="fs-card-head">
        <div className="fs-card-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002D6B" strokeWidth="1.8">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
            <line x1="6" y1="15" x2="10" y2="15"/>
            <line x1="14" y1="15" x2="18" y2="15"/>
          </svg>
        </div>
        <div className="fs-card-title-wrap">
          <span className="fs-card-id">{item.id}</span>
          <span className={`fs-badge ${isAvail ? "fs-badge-open" : "fs-badge-busy"}`}>
            {isAvail ? "● Available" : "● Busy"}
          </span>
        </div>
      </div>
      <h3 className="fs-card-name">{item.name}</h3>
      <div className="fs-card-info">
        <div className="fs-info-row"><PinIcon /><span>{item.terminal} · {item.location}</span></div>
        <div className="fs-info-row"><span className="fs-info-emoji">💳</span><span>Fee: <strong>{item.fee}</strong></span></div>
      </div>
      <div className="fs-tags">
        {item.accepts.map((a) => <span key={a} className="fs-tag">{a}</span>)}
      </div>
      <div className="fs-card-footer">
        <button className="fs-map-btn" onClick={() => navigate("/map")}><PinIcon /> Show on Map</button>
        <span className="fs-open-status" style={{ color: item.open ? "#16a34a" : "#dc2626" }}>
          {item.open ? "Open" : "Closed"}
        </span>
      </div>
    </div>
  );
}

function BankCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="fs-card">
      <div className="fs-card-bar" />
      <div className="fs-card-head">
        <div className="fs-card-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002D6B" strokeWidth="1.8">
            <path d="M3 22h18M3 10h18M5 10V22M19 10V22M12 2L3 10h18L12 2z"/>
          </svg>
        </div>
        <div className="fs-card-title-wrap">
          <span className="fs-card-id">{item.id}</span>
          <span className={`fs-badge ${item.open ? "fs-badge-open" : "fs-badge-closed"}`}>
            {item.open ? "● Open" : "○ Closed"}
          </span>
        </div>
      </div>
      <h3 className="fs-card-name">{item.name}</h3>
      <div className="fs-card-info">
        <div className="fs-info-row"><PinIcon /><span>{item.terminal} · {item.location}</span></div>
        <div className="fs-info-row"><span className="fs-info-emoji">🕐</span><span>{item.hours}</span></div>
      </div>
      <div className="fs-tags">
        {item.services.map((s) => <span key={s} className="fs-tag">{s}</span>)}
      </div>
      <div className="fs-card-footer">
        <button className="fs-map-btn" onClick={() => navigate("/map")}><PinIcon /> Show on Map</button>
        <span className="fs-open-status" style={{ color: item.open ? "#16a34a" : "#dc2626" }}>
          {item.open ? "Open" : "Closed"}
        </span>
      </div>
    </div>
  );
}

function CurrencyCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="fs-card">
      <div className="fs-card-bar" />
      <div className="fs-card-head">
        <div className="fs-card-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002D6B" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.5 9a3 3 0 0 1 5 0c0 2-3 3-3 3"/>
            <circle cx="12" cy="17" r=".5" fill="#002D6B"/>
          </svg>
        </div>
        <div className="fs-card-title-wrap">
          <span className="fs-card-id">{item.id}</span>
          <span className={`fs-badge ${item.open ? "fs-badge-open" : "fs-badge-closed"}`}>
            {item.open ? "● Open" : "○ Closed"}
          </span>
        </div>
      </div>
      <h3 className="fs-card-name">{item.name}</h3>
      <div className="fs-card-info">
        <div className="fs-info-row"><PinIcon /><span>{item.terminal} · {item.location}</span></div>
        <div className="fs-info-row"><span className="fs-info-emoji">💱</span><span><strong>{item.rate}</strong></span></div>
        <div className="fs-info-row"><span className="fs-info-emoji">📋</span><span>{item.commission}</span></div>
      </div>
      <div className="fs-card-footer">
        <button className="fs-map-btn" onClick={() => navigate("/map")}><PinIcon /> Show on Map</button>
        <span className="fs-open-status" style={{ color: item.open ? "#16a34a" : "#dc2626" }}>
          {item.open ? "Open" : "Closed"}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FinancialS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("atms");
  const [search, setSearch]       = useState("");
  const [filterOpen, setFilterOpen] = useState("all");
  const [data, setData] = useState({ atms: [], banks: [], currency: [] });

  useEffect(() => {
    let alive = true;
    servicesAPI
      .getAll("FINANCIAL")
      .then((res) => { if (alive) setData(mapFinancial(res.data?.data?.services)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const dataMap = data;
  const tabs = [
    { key: "atms",     label: "ATMs",              count: data.atms.length     },
    { key: "banks",    label: "Banks",             count: data.banks.length    },
    { key: "currency", label: "Currency Exchange", count: data.currency.length },
  ];

  const current = dataMap[activeTab].filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.terminal.toLowerCase().includes(q);
    const matchFilter =
      filterOpen === "all" ||
      (filterOpen === "open"   && item.open) ||
      (filterOpen === "closed" && !item.open);
    return matchSearch && matchFilter;
  });

  const openCount   = dataMap[activeTab].filter((i) =>  i.open).length;
  const closedCount = dataMap[activeTab].filter((i) => !i.open).length;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .fs-page {
          width: 100%;
          min-height: 100vh;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          color: #002D6B;
        }

        /* ── Hero ── */
        .fs-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .fs-hero-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }
        .fs-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(0,29,77,0.92) 35%, rgba(0,29,77,0.3) 75%);
          z-index: 1;
        }
        .fs-hero-content {
          position: relative; z-index: 2;
          padding: 56px 48px;
          max-width: 560px;
          color: #fff;
        }
        .fs-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(237,176,70,0.18);
          border: 1px solid rgba(237,176,70,0.5);
          color: #EDB046;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px;
          margin-bottom: 18px;
        }
        .fs-hero-title {
          font-size: 2.1rem; font-weight: 800;
          line-height: 1.22; margin: 0 0 14px; color: #fff;
        }
        .fs-hero-title span { color: #EDB046; }
        .fs-hero-sub {
          font-size: 0.88rem; line-height: 1.65;
          color: rgba(255,255,255,0.8); margin: 0 0 28px;
        }
        .fs-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .fs-btn-primary {
          background: #EDB046; color: #002D6B;
          border: none; border-radius: 8px;
          padding: 12px 26px; font-weight: 700;
          font-size: 0.88rem; cursor: pointer;
          font-family: inherit; transition: opacity 0.2s;
        }
        .fs-btn-primary:hover { opacity: 0.88; }

        /* ── CHANGE 1: View Map button bigger ── */
        .fs-btn-outline {
          background: transparent; color: #fff;
          border: 1.5px solid rgba(255,255,255,0.55);
          border-radius: 8px; padding: 16px 40px;
          font-weight: 700; font-size: 1rem;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .fs-btn-outline:hover { border-color: #EDB046; color: #EDB046; }

        /* ── Stats Bar ── */
        .fs-stats-bar { background: #002D6B; padding: 18px 0; }
        .fs-stats-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          display: flex; gap: 48px; align-items: center; flex-wrap: wrap;
        }
        .fs-stat-num {
          font-size: 1.4rem; font-weight: 800;
          color: #EDB046; line-height: 1;
        }
        .fs-stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          margin-top: 2px;
        }

        /* ── Main ── */
        .fs-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 44px 24px 60px;
        }

        /* ── Section Title ── */
        .fs-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 1.3rem; font-weight: 700; color: #002D6B;
          margin-bottom: 22px;
          border-left: 4px solid #EDB046;
          padding-left: 12px;
        }

        /* ── Toolbar ── */
        .fs-toolbar {
          display: flex; gap: 12px;
          align-items: center; flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .fs-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .fs-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          display: flex; align-items: center; pointer-events: none;
        }
        .fs-search-input {
          width: 100%;
          padding: 11px 16px 11px 42px;
          border: 1.5px solid #EDB046;
          border-radius: 10px;
          font-family: inherit; font-size: 0.88rem;
          color: #002D6B; background: #fff; outline: none;
          transition: border-color 0.2s;
        }
        .fs-search-input:focus { border-color: #002D6B; }
        .fs-search-input::placeholder { color: #9CA3AF; }

        .fs-filter-btns { display: flex; gap: 8px; }
        .fs-filter-btn {
          padding: 9px 16px; border-radius: 8px;
          border: 1.5px solid #EDB046;
          background: #fff; font-family: inherit;
          font-size: 0.82rem; font-weight: 600;
          color: #718096; cursor: pointer;
          transition: all 0.18s; white-space: nowrap;
        }
        .fs-filter-btn:hover { border-color: #002D6B; color: #002D6B; }
        .fs-filter-btn.fs-active { background: #002D6B; color: #fff; border-color: #002D6B; }

        /* ── Tabs ── */
        .fs-tabs {
          display: flex; gap: 0;
          border-bottom: 2px solid #E5EAF2;
          margin-bottom: 28px;
          overflow-x: auto;
        }
        .fs-tab-btn {
          background: none; border: none;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          padding: 11px 24px;
          font-family: inherit; font-size: 0.88rem;
          font-weight: 600; color: #9CA3AF;
          cursor: pointer; transition: all 0.18s;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .fs-tab-btn:hover { color: #002D6B; }
        .fs-tab-btn.fs-active { color: #002D6B; border-bottom: 3px solid #002D6B; }
        .fs-tab-count {
          background: #E5EAF2; color: #718096;
          font-size: 0.72rem; font-weight: 700;
          padding: 2px 8px; border-radius: 10px;
          transition: all 0.18s;
        }
        .fs-tab-btn.fs-active .fs-tab-count { background: #002D6B; color: #fff; }

        /* ── Grid ── */
        .fs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px;
        }

        /* ── Card ── */
        /* ── CHANGE 2: Card borders in Alexandria/teal color ── */
        .fs-card {
          background: #fff;
          border: 1.5px solid #EDB046;
          border-top: none;
          border-radius: 14px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex; flex-direction: column;
        }
        .fs-card:hover {
          box-shadow: 0 8px 28px rgba(237,176,70,0.25);
          transform: translateY(-2px);
        }
        .fs-card-bar { height: 16px; background: #002D6B; flex-shrink: 0; }
        .fs-card-head {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 18px 0;
        }
        .fs-card-icon-wrap {
          width: 42px; height: 42px; border-radius: 10px;
          background: #EEF2FF;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #E5EAF2;
        }
        .fs-card-title-wrap {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
        }
        .fs-card-id {
          font-size: 0.7rem; font-weight: 700;
          color: #9CA3AF; letter-spacing: 0.5px;
        }
        .fs-badge {
          font-size: 0.72rem; font-weight: 700;
          padding: 3px 10px; border-radius: 20px;
        }
        .fs-badge-open   { background: #DCFCE7; color: #16a34a; }
        .fs-badge-closed { background: #FEE2E2; color: #dc2626; }
        .fs-badge-busy   { background: #FEF3C7; color: #D97706; }

        .fs-card-name {
          font-size: 0.97rem; font-weight: 700;
          color: #002D6B; margin: 12px 18px 10px;
          line-height: 1.35;
        }
        .fs-card-info {
          padding: 0 18px;
          display: flex; flex-direction: column;
          gap: 7px; flex: 1;
        }
        .fs-info-row {
          display: flex; align-items: center;
          gap: 7px; font-size: 0.8rem; color: #4B5563;
        }
        .fs-info-emoji { font-size: 0.82rem; }
        .fs-info-row strong { color: #002D6B; font-weight: 700; }

        .fs-tags {
          display: flex; flex-wrap: wrap;
          gap: 6px; padding: 12px 18px;
        }
        .fs-tag {
          background: #F1F5F9; color: #002D6B;
          font-size: 0.72rem; font-weight: 600;
          padding: 4px 10px; border-radius: 6px;
          border: 1px solid #E2E8F0;
        }

        .fs-card-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 1px solid #EDB046;
          margin-top: auto;
        }
        .fs-map-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: none; border: none;
          color: #002D6B; font-size: 0.8rem; font-weight: 700;
          cursor: pointer; font-family: inherit; padding: 0;
          transition: color 0.2s;
        }
        .fs-map-btn:hover { color: #EDB046; }
        .fs-open-status { font-size: 0.78rem; font-weight: 700; }

        /* ── Empty ── */
        .fs-empty {
          text-align: center; padding: 70px 0;
          color: #9CA3AF; font-size: 0.95rem;
        }
        .fs-empty-icon { font-size: 2.5rem; margin-bottom: 12px; }

        /* ── CHANGE 3: Banner section white background, cards primary navy color ── */
        .fs-banner { background: #ffffff; padding: 52px 0; margin-top: 20px; border-top: 1px solid #EDB046; }
        .fs-banner-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .fs-banner-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 1.2rem; font-weight: 700; color: #002D6B;
          margin-bottom: 28px;
          border-left: 4px solid #EDB046; padding-left: 12px;
        }
        .fs-banner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .fs-banner-card {
          background: #002D6B;
          border: 1px solid #002D6B;
          border-radius: 14px; padding: 26px 22px;
          text-align: center;
        }
        .fs-banner-emoji { font-size: 2rem; margin-bottom: 12px; display: block; }
        .fs-banner-card h4 { color: #EDB046; font-size: 0.92rem; font-weight: 700; margin: 0 0 8px; }
        .fs-banner-card p { color: rgba(255,255,255,0.7); font-size: 0.8rem; line-height: 1.6; margin: 0; }
      `}</style>

      <div className="fs-page">
        <Navbar />

        {/* ── Hero ── */}
        <section className="fs-hero">
          <img src="/images/airport-bg.jpg" alt="Airport" className="fs-hero-bg" />
          <div className="fs-hero-overlay" />
          <div className="fs-hero-content">
          
            <h1 className="fs-hero-title">
              Your Airport <span>Financial</span><br />Services, One Click Away
            </h1>
            <p className="fs-hero-sub">
              Find ATMs, Banks and Currency Exchange services inside the airport — all terminals covered.
            </p>
            <div className="fs-hero-btns">
            
              <button className="fs-btn-outline" onClick={() => navigate("/map")}>
                View Map
              </button>
            </div>
          </div>
        </section>



        {/* ── Content ── */}
        <div className="fs-main" id="fs-content">
          <h2 className="fs-section-title">
            <PlaneIcon /> Airport Financial Services
          </h2>

          {/* Toolbar */}
          <div className="fs-toolbar">
            <div className="fs-search-wrap">
              <span className="fs-search-icon"><SearchIcon /></span>
              <input
                className="fs-search-input"
                type="text"
                placeholder="Search by name, terminal or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="fs-filter-btns">
              {[
                { key: "all",    label: `All (${dataMap[activeTab].length})` },
                { key: "open",   label: `Open (${openCount})`                },
                { key: "closed", label: `Closed (${closedCount})`            },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`fs-filter-btn${filterOpen === f.key ? " fs-active" : ""}`}
                  onClick={() => setFilterOpen(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="fs-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`fs-tab-btn${activeTab === t.key ? " fs-active" : ""}`}
                onClick={() => { setActiveTab(t.key); setSearch(""); setFilterOpen("all"); }}
              >
                {t.label}
                <span className="fs-tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          {current.length === 0 ? (
            <div className="fs-empty">
              <div className="fs-empty-icon">🔍</div>
              No results found{search ? ` for "${search}"` : ""}
            </div>
          ) : (
            <div className="fs-grid">
              {activeTab === "atms"     && current.map((i) => <ATMCard      key={i.id} item={i} />)}
              {activeTab === "banks"    && current.map((i) => <BankCard     key={i.id} item={i} />)}
              {activeTab === "currency" && current.map((i) => <CurrencyCard key={i.id} item={i} />)}
            </div>
          )}
        </div>

        {/* ── Info Banner ── */}
        <div className="fs-banner">
          <div className="fs-banner-inner">
            <h3 className="fs-banner-title"><PlaneIcon /> Good to Know</h3>
            <div className="fs-banner-grid">
              {[
                { emoji: "💱", title: "Live Exchange Rates",  desc: "Real-time currency rates at airport exchange points for all major world currencies." },
                { emoji: "🏧", title: "24/7 ATM Access",      desc: "Multiple ATMs spread across all terminals — accessible around the clock, every day." },
                { emoji: "🔒", title: "Secure Transactions",  desc: "All banking and exchange services comply with international security standards."      },
                { emoji: "📍", title: "Easy to Find",         desc: "All services are mapped — tap Show on Map on any card to navigate directly."          },
              ].map((c) => (
                <div key={c.title} className="fs-banner-card">
                  <span className="fs-banner-emoji">{c.emoji}</span>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
