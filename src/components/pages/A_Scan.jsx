import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import Swal from "sweetalert2";
import { flightAPI } from "../../../utils/Api.js";
import BarcodeScanner from "../shared/BarcodeScanner.jsx";

const STATUS_COLOR = { DELAYED: "#EDB046", CANCELLED: "#e53e3e", BOARDING: "#38a169", ON_TIME: "#17a2b8" };
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
const niceStatus = (s = "") => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : "");

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlaneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const QRIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="1.5">
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
   <svg width="18" height="18" viewBox="0 0 24 24" fill="#EDB046">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EgyptAirIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#002D6B">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const CountersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const VIPIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FinancialIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <circle cx="12" cy="4" r="2" />
    <path d="M10 7L8 13h8l1 4H9.5L8 22H6l1.5-5H6l2-8 2-2z" />
  </svg>
);

const ShopsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <path d="M3 9l1-6h16l1 6" />
    <path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
    <path d="M9 9v3a3 3 0 0 0 6 0V9" />
  </svg>
);

const RestaurantIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDB046" strokeWidth="2">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const DEFAULT_UPDATED = [
  { flight: "Flight: EK905", from: "Cairo", to: "Dubai", before: "Departure 10:30 AM", after: "Departure 11:00 AM", status: "Delayed", badgeColor: "#EDB046" },
  { flight: "Flight: EK905", from: "Cairo", to: "Dubai", before: "Gate B12", after: "Gate C7", status: "Gate changed", badgeColor: "#17a2b8" },
  { flight: "Flight: EK905", from: "Cairo", to: "Dubai", before: "Departure 10:30 AM", after: "Departure 11:00 AM", status: "Delayed", badgeColor: "#EDB046" },
];

export default function AScan() {
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(DEFAULT_UPDATED);
  const [track, setTrack] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let alive = true;
    flightAPI.getUpdated().then((res) => {
      if (!alive) return;
      const flights = res.data?.data?.flights || [];
      if (flights.length) {
        setUpdated(flights.slice(0, 3).map((f) => {
          const from = f.route?.from || f.route?.fromCode || "—";
          const to = f.route?.to || f.route?.toCode || "—";
          if (f.changeType === "GATE" || f.gateAfter) {
            return {
              flight: `Flight: ${f.flightNumber}`, from, to,
              before: `Gate ${f.gateBefore || "—"}`,
              after: `Gate ${f.gateAfter || "—"}`,
              status: "Gate changed", badgeColor: "#17a2b8",
            };
          }
          return {
            flight: `Flight: ${f.flightNumber}`, from, to,
            before: `Departure ${fmtTime(f.departure?.scheduledTime)}`,
            after: `Departure ${fmtTime(f.departure?.estimatedTime)}`,
            status: niceStatus(f.status),
            badgeColor: STATUS_COLOR[f.status] || "#EDB046",
          };
        }));
      }
    }).catch(() => {});
    flightAPI.getMyFlight().then((res) => { if (alive) setTrack(res.data?.data || null); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const tf = track?.flight;
  const trackAirline = tf?.airline?.name || "Egypt Air";
  const trackNo = tf?.flightNumber || "MS359";
  const trackTime = fmtTime(tf?.departure?.scheduledTime) || "11:25";
  const trackStatus = tf?.status ? niceStatus(tf.status) : "Boarding";

  const handleScanned = async (barcodeData) => {
    setScanning(false);
    if (!barcodeData) return;
    try {
      await flightAPI.scanBoardingPass(barcodeData.trim());
      Swal.fire({ icon: "success", title: "Flight tracked!", showConfirmButton: false, timer: 1300 });
      navigate("/explore");
    } catch (e) {
      Swal.fire({ icon: "error", title: "Scan failed", text: e.response?.data?.message || "Invalid boarding pass." });
    }
  };

  const handleCancelTrack = async () => {
    const id = tf?._id || tf?.id;
    try {
      if (id) await flightAPI.cancelTrack(id);
      setTrack(null);
      Swal.fire({ icon: "success", title: "Tracking cancelled", showConfirmButton: false, timer: 1200 });
    } catch {
      navigate("/home");
    }
  };

  const services = [
    { icon: <CountersIcon />, title: "Counters", sub: "Domestic & International", path: "/counters" },
    { icon: <VIPIcon />, title: "VIP Experience", sub: "Premium Lounges", path: "/vip" },
    { icon: <FinancialIcon />, title: "Financial Services", sub: "ATM & Currency Exchange", path: "/financial" },
    { icon: <AccessibilityIcon />, title: "Accessibility", sub: "Special Assistance", path: "/accessibility" },
    { icon: <ShopsIcon />, title: "Shops", sub: "Duty-Free & Retail", path: "/shops" },
    { icon: <RestaurantIcon />, title: "Restaurant", sub: "Dining Options", path: "/shops" },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      {scanning && <BarcodeScanner onScan={handleScanned} onClose={() => setScanning(false)} />}

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <img src="/images/airport-bg.jpg" alt="hero" style={styles.heroBg} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Track Your Flight</h1>
          <p style={styles.heroSub}>
            Scan your boarding pass to start tracking — get gate updates, boarding
            reminders, and destination tips in one place.
          </p>
        </div>
      </section>

      {/* ── Updated Flights ── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleBar}>
            <span style={styles.titleIcon}><PlaneIcon /></span>
            Updated Flights
          </h2>
          <p style={styles.sectionSubtitle}>Stay informed about the latest flight and gate changes.</p>
          <div style={styles.flightCardsRow}>
            {updated.map((f, i) => (
<div style={styles.flightCard} key={i}>
  <div style={styles.flightCardRow1} />

<div style={styles.flightCardRow2}>

  <div style={styles.flightContentRow}>

    {/* LEFT SIDE */}
    <div style={styles.flightLeftColumn}>
      <div style={styles.flightNumDark}>{f.flight}</div>

      <div style={styles.flightChange}>
        <span style={styles.flightLabel}>Before:</span>
        <span style={styles.flightValRed}>{f.before}</span>
      </div>

      <div style={styles.flightChange}>
        <span style={styles.flightLabel}>After:</span>
        <span style={styles.flightValGreen}>{f.after}</span>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div style={styles.flightRightColumn}>
      <div style={styles.flightRouteDark}>
        {f.from} → {f.to}
      </div>

      <span
        style={{
          ...styles.flightBadge,
          background: f.badgeColor,
          marginTop: 10,
        }}
      >
        {f.status}
      </span>
    </div>

  </div>

</div>
</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Your Tracked Flight ── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleBar}>
            <span style={styles.titleIcon}><PlaneIcon /></span>
            Your Tracked Flight
          </h2>
          <div style={styles.trackedGrid}>
{/* Tracked Flight Card — only when there is an active tracked flight */}
{tf ? (
<div style={styles.trackedCard}>
  <div style={styles.trackedCardBlueTop} />

  <div style={styles.trackedCardHeader}>
    <div style={styles.airlineRow}>
      <div style={styles.airlineLogo}>
        <img
          src={tf?.airline?.logo || "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Egyptair_logo_%282010%29.svg/320px-Egyptair_logo_%282010%29.svg.png"}
          alt={trackAirline}
          style={styles.airlineLogoImg}
          onError={(e) => { e.target.style.display="none"; }}
        />
      </div>
      <div>
        <div style={styles.airlineName}>{trackAirline}</div>
        <div style={styles.flightNumSmall}>Flight No: {trackNo}</div>
      </div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={styles.trackedTime}>{trackTime}</div>
      <div style={styles.boardingBadge}>● {trackStatus}</div>
    </div>
  </div>

  <div style={styles.trackedCardActions}>
    <button style={styles.btnExplore} onClick={() => navigate("/explore")}>🌍 Explore Destination</button>
    <button style={styles.btnCancel} onClick={handleCancelTrack}>✕ Cancel Tracking</button>
  </div>
</div>
) : (
<div style={styles.trackedCard}>
  <div style={styles.trackedCardBlueTop} />
  <div style={{ flex: 1, padding: "34px 20px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, borderLeft: "1.5px solid #EDB046", borderRight: "1.5px solid #EDB046", borderBottom: "1.5px solid #EDB046", borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
    <div style={{ fontSize: "2rem" }}>✈️</div>
    <div style={{ fontWeight: 700, color: "#002D6B" }}>No tracked flight</div>
    <div style={{ fontSize: "0.85rem", color: "#718096" }}>Scan your boarding pass to start tracking.</div>
  </div>
</div>
)}

  {/* Quick Track / QR Card */}   {/* ← حطي الكود هنا */}
  <div style={styles.quickTrackCard}>
    <div style={styles.quickTrackBlueTop} />
    <div style={styles.quickTrackBody}>
<div style={{ width: "100%", textAlign: "left" , fontSize:"5 rem" }}>
  <h3 style={styles.quickTrackTitle}>Quick Track</h3>
</div>
      <div style={styles.qrCenter}>
        <QRIcon />
      </div>
      <p style={styles.qrDesc}>
        Scan your boarding pass QR code to start tracking your flight
      </p>
      <button style={styles.btnScan} onClick={() => setScanning(true)}>
        <CameraIcon />
        &nbsp; Scan Your Boarding pass
      </button>
    </div>
  </div>
          </div>
        </div>
      </section>

      {/* ── Airport Services ── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleBar}>
            <span style={styles.titleIcon}><PlaneIcon /></span>
            Airport Services
          </h2>
          <div style={styles.servicesGrid}>
            {services.map((s, i) => (
              <div
                key={i}
                style={{ ...styles.serviceCard, ...(s.path ? { cursor: "pointer" } : {}) }}
                onClick={() => s.path && navigate(s.path)}
              >
                <div style={styles.serviceIcon}>{s.icon}</div>
                <div style={styles.serviceTitle}>{s.title}</div>
                <div style={styles.serviceSub}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
<Footer />
    </div>
  );
}


// ── Inline Styles ─────────────────────────────────────────────────────────────
const styles = {
  page: {
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    color: "#002D6B",
    background: "#ffffff",
    minHeight: "100vh",
  },
  hero: {
    position: "relative",
    minHeight: 380,
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
    zIndex: 0,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, rgba(0,29,77,0.85) 20%, rgba(0,29,77,0.25) 60%)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 520,
    padding: "60px 40px",
    color: "white",
  },
heroTitle: {
  fontSize: "2.7rem",   // بدل 2.4
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: 16,
  fontFamily: "'Playfair Display', serif",
},
  heroSub: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.88)",
  },
section: {
  padding: "40px 0",
  background: "#F7F9FC",   // بدل #fff
},
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
  },
  sectionTitleBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#002D6B",
    marginBottom: 8,
    borderLeft: "4px solid #EDB046",
    paddingLeft: 12,
  },
  titleIcon: {
    display: "flex",
    alignItems: "center",
  },
sectionSubtitle: {
  fontSize: "0.85rem",
  color: "#718096",   // أفتح شوية
  marginBottom: 24,
  paddingLeft: 16,
},
  // Flight Cards
  flightCardsRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
flightCard: {
  flex: "1 1 300px",
  border: "none",          // ← شيل البوردر
  borderRadius: 8,
  overflow: "hidden",
  background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
},

flightCardRow2: {
  padding: "18px 18px 16px",   // زودنا المسافة شوية
  display: "flex",
  flexDirection: "column",
  gap: 6,                      // مسافة منظمة بين العناصر
  borderLeft: "1.5px solid #EDB046",
  borderRight: "1.5px solid #EDB046",
  borderBottom: "1.5px solid #EDB046",
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
},
flightContentRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",   // يخلي اليمين في منتصف الكارد
},
flightLeftColumn: {
  display: "flex",
  flexDirection: "column",
  gap: 8,
},
flightRightColumn: {
  display: "flex",
  flexDirection: "column",
alignItems: "center",
  justifyContent: "center",
},

flightRouteRow: {
  display: "flex",
  alignItems: "center",
  gap: 5,
  fontSize: "0.85rem",
  marginBottom: 12,
},
flightRouteLabel: {
  color: "#718096",
  fontWeight: 400,
},
flightRouteCity: {
  color: "#002D6B",
  fontWeight: 700,
},
flightRouteArrow: {
  color: "#002D6B",
  fontWeight: 700,
  fontSize: "60px",
},
flightCardRow1: {
  background: "#002D6B",
  height: 25,
},

flightNum: {
  fontWeight: 700,
  fontSize: "20px",
  color: "#fff",
},

flightRoute: {
  fontSize: "0.78rem",
  color: "#fff",
  fontWeight: 600,
},
flightBadge: {
  color: "#fff",
  fontSize: "0.78rem",
  fontWeight: 700,
  borderRadius: 24,
  padding: "6px 16px",
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
},
  flightChange: {
    display: "flex",
    gap: 6,
    fontSize: "0.82rem",
    marginBottom: 4,
    alignItems: "center",
  },
  flightLabel: {
    color: "#002D6B",
      fontSize: "1rem", 
    fontWeight: 600,
  },
  flightValRed: {
    color: "#e53e3e",
    fontWeight: 600,
  },
  flightValGreen: {
    color: "#38a169",
    fontWeight: 600,
  },
  // Tracked Flight
trackedGrid: {
  display: "flex",
  gap: 20,
  marginTop: 20,
  flexWrap: "nowrap",   // ← غير من wrap لـ nowrap
  alignItems: "stretch",
},

trackedCardActions: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: "24px 20px 28px",   // ← زود الـ padding تحت
  alignItems: "center",
  borderLeft: "1.5px solid #EDB046",
  borderRight: "1.5px solid #EDB046",
  borderBottom: "1.5px solid #EDB046",
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
  flex: 1,                      // ← يملا الباقي
},

trackedCard: {
  flex: "0 0 55%",
  background: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
},
trackedCardBlueTop: {
  background: "#002D6B",
  height: 35,
},
trackedCardHeader: {
  background: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  borderLeft: "1.5px solid #EDB046",
  borderRight: "1.5px solid #EDB046",
  borderBottom: "1px solid #EDF2F7",
},
  airlineRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  flightTopRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 8,   // أهم فرق عن عندك
},

airlineLogo: {
  width: 48,
  height: 48,
  borderRadius: "50%",
  overflow: "hidden",
  background: "#002D6B",      // ← خلليه أزرق عشان اللوجو يبان
  border: "2px solid #E5EAF2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
},
  airlineLogoImg: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: "50%",
  },
airlineName: {
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#002D6B",     // ← أزرق مش أبيض
},

flightNumSmall: {
  fontSize: "0.85rem",
  color: "#718096",     // ← رمادي
  fontWeight: 500,
},
flightRouteCity2: {
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.78rem",
},

trackedTime: {
  fontSize: "2rem",
  fontWeight: 500,
  color: "#002D6B",     // ← أزرق مش أبيض
  lineHeight: 1,
  textAlign: "right",
},

boardingBadge: {
  color: "#EDB046",
  fontWeight: 700,
  fontSize: "0.85rem",
  textAlign: "right",
},


btnExplore: {
  background: "#002D6B",
  color: "#EDB046",
  border: "none",
  padding: "13px",
  borderRadius: 8,     // ← مش pill
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "80%",
},

btnCancel: {
  background: "#fff",
  color: "#002D6B",
  border: "1.5px solid #EDB046",
  padding: "13px",
  borderRadius: 8,     // ← مش pill
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "80%",
  
},
quickTrackCard: {
  flex: "0 0 42%",
  background: "#fff",
  border: "none",          // ← شيل البوردر من الكارت كله
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
},

quickTrackBlueTop: {
  background: "#002D6B",
  height: 30,              // ← نفس ارتفاع الـ trackedCardBlueTop
},

quickTrackBody: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "22px",
  borderLeft: "1.5px solid #EDB046",
  borderRight: "1.5px solid #EDB046",
  borderBottom: "1.5px solid #EDB046",
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
},

quickTrackTitle: {
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#002D6B",
  marginBottom: 0,
  alignSelf: "flex-start",  // ← النص على اليسار زي الصورة
},
  qrCenter: {
    margin: "12px 0",
  },

qrDesc: {
  fontSize: "0.85rem",
  color: "#EDB046",
  lineHeight: 1.5,
  marginBottom: 20,
},
btnScan: {
  background: "#002D6B",
  color: "#EDB046",
  border: "none",
  borderRadius: 8,        // ← نفس الـ borderRadius
  padding: "13px",        // ← نفس الـ padding
  fontWeight: 700,
  fontSize: "0.9rem",     // ← نفس الـ fontSize
  cursor: "pointer",
  width: "80%",           // ← نفس الـ width
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
},
  // Airport Services
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
    marginTop: 20,
  },
serviceCard: {
  background: "#fff",
  border: "1px solid #EDF2F7",
  borderRadius: 12,
  padding: "22px 16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  transition: "all 0.2s ease",
},
  serviceIcon: {
    marginBottom: 4,
  },
  serviceTitle: {
    fontWeight: 700,
    fontSize: "0.88rem",
    color: "#002D6B",
  },
  serviceSub: {
    fontSize: "0.75rem",
    color: "#EDB046",
    fontWeight: 500,
  },
  flightHeaderWhite: {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
},

flightNumDark: {
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#002D6B",
},

flightRouteDark: {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#002D6B",
},
};
