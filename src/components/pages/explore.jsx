import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { flightAPI } from "../../../utils/Api.js";

const PlaneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const DEFAULT_DESTINATIONS = [
  {
    id: 1,
    name: "Burj Khalifa",
    tagline: "Burj Khalifa",
    description: "Historic capital with royal heritage and modern attractions",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
  },
  {
    id: 2,
    name: "Desert Safari",
    tagline: "Desert Safari",
    description: "City of lights with romantic atmosphere and rich culture",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80",
  },
  {
    id: 3,
    name: "Global Village",
    tagline: "global village",
    description: "Modern metropolis with luxury shopping and stunning architecture",
    image: "https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=600&q=80",
  },
];

const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

export default function Explore() {
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);

  useEffect(() => {
    let alive = true;
    flightAPI
      .getMyFlight()
      .then((res) => {
        if (!alive) return;
        const d = res.data?.data;
        setTrack(d || null);
        const recs = d?.recommendations || [];
        if (recs.length) {
          setDestinations(
            recs.slice(0, 3).map((r, i) => ({
              id: i,
              name: r.name,
              tagline: r.name,
              description: r.description || r.vicinity || r.category || "",
              image: r.image || DEFAULT_DESTINATIONS[i % 3].image,
            }))
          );
        }
      })
      .catch(() => { /* not logged in / no active track → keep defaults */ });
    return () => { alive = false; };
  }, []);

  // Tracked-flight card values (fall back to the static sample when no active track).
  const f = track?.flight;
  const airlineName = f?.airline?.name || "Egypt Air";
  const flightNo = f?.flightNumber || "MS359";
  const gate = f?.gate || f?.departure?.gate || "C14";
  const statusLabel = f?.status
    ? f.status.charAt(0) + f.status.slice(1).toLowerCase().replace(/_/g, " ")
    : "Boarding";
  const routeTime = fmtTime(f?.departure?.scheduledTime) || "11:25";
  const routeDate = fmtDate(f?.departure?.scheduledTime) || "15 Oct 2025";
  const routeCode = f?.route ? `${f.route.fromCode || f.route.from}→${f.route.toCode || f.route.to}` : "HENI→DUXB";
  const routeTerminal = f?.departure?.terminal || track?.airport?.code || "T2";

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero */}
      <section style={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80"
          alt="UAE hero"
          style={styles.heroBg}
        />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Explore Destinations</h1>
          <p style={styles.heroSub}>
            Discover amazing places to visit during your layover or after you land.
            Make the most of your journey.
          </p>
        </div>
      </section>

      {/* Tracked Flight Card */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleBar}>
            <span style={styles.titleIcon}><PlaneIcon /></span>
            Tracked Flight
          </h2>
          <div style={styles.trackedCardWrap}>
            <div style={styles.trackedCard}>

              {/* Blue top strip with icons */}
              <div style={styles.trackedCardBlueTop}>
                <span style={{ fontSize: "1.2rem" }}>✈</span>
                <svg
                  onClick={() => navigate("/home")}
                  style={{ cursor: "pointer" }}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EDB046"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <line x1="2" y1="2" x2="22" y2="22" stroke="#EDB046" strokeWidth="2" />
                </svg>
              </div>

              {/* Header */}
              <div style={styles.trackedCardHeader}>
                <div style={styles.airlineRow}>
                  <div style={styles.airlineLogo}>
                    <img
                     src="/images/egyair%20logo.png"
                      alt="Egypt Air"
                      style={styles.airlineLogoImg}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <div style={styles.airlineName}>{airlineName}</div>
                    <div style={styles.flightNumSmall}>Flight No: {flightNo}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.gateText}>Gate: {gate}</div>
                  <div style={styles.boardingBadge}>● {statusLabel}</div>
                </div>
              </div>

              {/* Route Row */}
              <div style={styles.routeRow}>
                <div>
                  <div style={styles.routeTime}>{routeTime}</div>
                  <div style={styles.routeDate}>{routeDate}</div>
                </div>
                <div style={styles.routeArrow}>
                  <svg width="80" height="16" viewBox="0 0 80 16">
                    <line x1="0" y1="8" x2="72" y2="8" stroke="#002D6B" strokeWidth="1.5" strokeDasharray="4 3" />
                    <polygon points="72,4 80,8 72,12" fill="#002D6B" />
                  </svg>
                </div>
<div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
}}>
  <div style={styles.routeCode}>{routeCode}</div>
  <div style={styles.routeTerminal}>{routeTerminal}</div>
</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Top Places Section */}
      <section style={{ ...styles.section, background: "#fff" }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleBar}>
            <span style={styles.titleIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </span>
            Top places to visit in the United Arab Emirates
          </h2>

          <div style={styles.destinationsGrid}>
            {destinations.map((dest) => (
              <div key={dest.id} style={styles.destCard}>
                <div style={styles.destImageWrap}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={styles.destImage}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80";
                    }}
                  />
                </div>
                <div style={styles.destBody}>
                  <div style={styles.destTagline}>{dest.tagline}</div>
                  <div style={styles.destDescription}>{dest.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    color: "#002D6B",
    background: "#F7F9FC",
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
    fontSize: "2.7rem",
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
    background: "#F7F9FC",
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
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#002D6B",
    marginBottom: 20,
    borderLeft: "4px solid #EDB046",
    paddingLeft: 12,
  },
  titleIcon: {
    display: "flex",
    alignItems: "center",
  },
  trackedCardWrap: {
    display: "flex",
  },
  trackedCard: {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  trackedCardBlueTop: {
    background: "#002D6B",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  },
  trackedCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #E5EAF2",
    borderLeft: "1.5px solid #EDB046",
    borderRight: "1.5px solid #EDB046",
  },
  airlineRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  airlineLogo: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#002D6B",
    border: "2px solid #E5EAF2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  airlineLogoImg: {
    width: 44,
    height: 44,
    objectFit: "cover",
    borderRadius: "50%",
  },
  airlineName: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#002D6B",
  },
  flightNumSmall: {
    fontSize: "0.8rem",
    color: "#718096",
    fontWeight: 500,
  },
  gateText: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#002D6B",
  },
  boardingBadge: {
    color: "#EDB046",
    fontWeight: 700,
    fontSize: "0.82rem",
    textAlign: "right",
  },
  routeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderLeft: "1.5px solid #EDB046",
    borderRight: "1.5px solid #EDB046",
    borderBottom: "1.5px solid #EDB046",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  routeTime: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#002D6B",
  },
  routeDate: {
    fontSize: "0.78rem",
    color: "#002D6B",
  },
  routeArrow: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
  routeCode: {
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#002D6B",
    textAlign: "right",
  },
  routeTerminal: {
    fontSize: "0.78rem",
    color: "#002D6B",
    textAlign: "right",
    alignItems: "center",
  },
  destinationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginTop: 8,
  },
  destCard: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    border: "1px solid #EDF2F7",
  },
  destImageWrap: {
    width: "100%",
    height: 180,
    overflow: "hidden",
  },
  destImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  destBody: {
    padding: "16px",
    textAlign: "center",
  },
  destTagline: {
    color: "#EDB046",
    fontWeight: 700,
    fontSize: "0.9rem",
    marginBottom: 6,
  },
  destDescription: {
    color: "#002D6B",
    fontSize: "0.82rem",
    lineHeight: 1.5,
    fontWeight: 500,
  },
};