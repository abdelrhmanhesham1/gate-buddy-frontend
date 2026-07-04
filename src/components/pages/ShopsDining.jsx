import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { servicesAPI } from "../../../utils/Api.js";

const PRIMARY = "#002D6B";
const SECONDARY = "#EDB046";

function ServiceCard({ s }) {
  const navigate = useNavigate();
  const img = (s.images && s.images[0]) || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&w=800";
  return (
    <div style={S.card}>
      <div style={S.imgWrap}>
        <img
          src={img}
          alt={s.name}
          style={S.img}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&w=800"; }}
        />
        {s.rating ? <span style={S.rating}>★ {s.rating}</span> : null}
      </div>
      <div style={S.body}>
        <h3 style={S.name}>{s.name}</h3>
        {s.description && <p style={S.desc}>{s.description}</p>}
        {s.cuisine && s.cuisine.length > 0 && (
          <div style={S.tags}>
            {s.cuisine.slice(0, 4).map((c) => <span key={c} style={S.tag}>{c}</span>)}
          </div>
        )}
        <div style={S.meta}>
          {(s.terminal || s.zone) && <span>📍 {[s.terminal, s.zone].filter(Boolean).join(" · ")}</span>}
          {s.operatingHours && <span>🕐 {s.operatingHours}</span>}
        </div>
        <button style={S.mapBtn} onClick={() => navigate("/map")}>Show on Map</button>
      </div>
    </div>
  );
}

export default function ShopsDining() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dining");
  const [shops, setShops] = useState([]);
  const [dining, setDining] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([servicesAPI.getAll("RESTAURANTS"), servicesAPI.getAll("SHOPS")])
      .then(([r, sh]) => {
        if (!alive) return;
        setDining(r.data?.data?.services || []);
        setShops(sh.data?.data?.services || []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const list = (tab === "dining" ? dining : shops).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.page}>
      <Navbar />

      <section style={S.hero}>
        <button style={S.back} onClick={() => navigate("/home")}>←</button>
        <div style={S.heroInner}>
          <span style={S.eyebrow}>AIRPORT EXPERIENCE</span>
          <h1 style={S.title}>Shops &amp; Dining</h1>
          <p style={S.sub}>Discover restaurants, cafés, and shops across the terminals.</p>
        </div>
      </section>

      <div style={S.main}>
        <div style={S.controls}>
          <div style={S.tabs}>
            <button style={{ ...S.tab, ...(tab === "dining" ? S.tabActive : {}) }} onClick={() => { setTab("dining"); setSearch(""); }}>
              🍽️ Dining ({dining.length})
            </button>
            <button style={{ ...S.tab, ...(tab === "shops" ? S.tabActive : {}) }} onClick={() => { setTab("shops"); setSearch(""); }}>
              🛍️ Shops ({shops.length})
            </button>
          </div>
          <input style={S.search} placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div style={S.empty}>Loading…</div>
        ) : list.length === 0 ? (
          <div style={S.empty}>No results found.</div>
        ) : (
          <div style={S.grid}>
            {list.map((s) => <ServiceCard key={s._id} s={s} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

const S = {
  page: { background: "#fff", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  hero: { position: "relative", background: `linear-gradient(135deg, ${PRIMARY} 0%, #001a42 100%)`, padding: "48px 24px 56px" },
  back: { position: "absolute", top: 18, left: 20, width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" },
  heroInner: { maxWidth: 1100, margin: "0 auto" },
  eyebrow: { color: SECONDARY, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em" },
  title: { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "8px 0 6px" },
  sub: { color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", margin: 0 },
  main: { flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "28px 24px 60px" },
  controls: { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 },
  tabs: { display: "flex", gap: 4, background: "#fff", border: `1.5px solid ${SECONDARY}`, borderRadius: 12, padding: 4 },
  tab: { padding: "10px 22px", borderRadius: 9, border: "none", background: "transparent", color: "#6b7280", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" },
  tabActive: { background: PRIMARY, color: "#fff" },
  search: { flex: 1, minWidth: 200, maxWidth: 320, border: `1.5px solid ${SECONDARY}`, borderRadius: 10, padding: "10px 16px", fontSize: "0.88rem", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 22 },
  card: { background: "#fff", border: `1.5px solid ${SECONDARY}`, borderTop: "none", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,45,107,0.06)" },
  imgWrap: { position: "relative", height: 170, overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  rating: { position: "absolute", top: 12, right: 12, background: SECONDARY, color: PRIMARY, fontWeight: 800, fontSize: "0.78rem", padding: "3px 10px", borderRadius: 20 },
  body: { padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 },
  name: { color: PRIMARY, fontSize: "1rem", fontWeight: 700, margin: "0 0 8px" },
  desc: { color: "#6b7280", fontSize: "0.84rem", lineHeight: 1.55, margin: "0 0 12px" },
  tags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  tag: { fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", border: "1px solid #c7d2fe" },
  meta: { display: "flex", flexDirection: "column", gap: 5, fontSize: "0.8rem", color: "#4b5563", marginBottom: 14 },
  mapBtn: { marginTop: "auto", background: PRIMARY, color: SECONDARY, border: "none", borderRadius: 8, padding: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" },
  empty: { textAlign: "center", color: "#9ca3af", padding: "60px 0", fontSize: "0.95rem" },
};
