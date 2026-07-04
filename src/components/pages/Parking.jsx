import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import Swal from "sweetalert2";
import { parkingAPI } from "../../../utils/Api.js";

const PRIMARY = "#002D6B";
const SECONDARY = "#EDB046";

const EMPTY = { label: "", terminal: "", level: "", section: "", spot: "", note: "" };

export default function Parking() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    parkingAPI
      .getAll()
      .then((res) => setSpots(res.data?.data?.parkings || []))
      .catch(() => setSpots([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.spot && !form.section && !form.level && !form.terminal && !form.label) {
      Swal.fire({ icon: "info", title: "Add at least one detail", text: "Enter a spot, section, level or terminal." });
      return;
    }
    setSaving(true);
    try {
      await parkingAPI.create(form);
      setForm(EMPTY);
      load();
      Swal.fire({ icon: "success", title: "Parking saved!", showConfirmButton: false, timer: 1200 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Couldn't save", text: err.response?.data?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const ok = await Swal.fire({
      icon: "warning", title: "Remove this parking?", showCancelButton: true,
      confirmButtonText: "Remove", confirmButtonColor: "#dc2626",
    });
    if (!ok.isConfirmed) return;
    try {
      await parkingAPI.remove(id);
      setSpots((s) => s.filter((x) => x._id !== id));
    } catch {
      Swal.fire({ icon: "error", title: "Couldn't remove" });
    }
  };

  return (
    <div style={S.page}>
      <Navbar />

      <section style={S.hero}>
        <img src="/images/airport-bg.jpg" alt="" style={S.heroBg} onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div style={S.heroOverlay} />
        <button style={S.back} onClick={() => navigate("/profile")}>←</button>
        <div style={S.heroInner}>
          <span style={S.eyebrow}>🚗 MY GARAGE</span>
          <h1 style={S.title}>Saved Parking</h1>
          <p style={S.sub}>Save where you parked so you can find your car the moment you land.</p>
          <div style={S.heroStats}>
            <div style={S.stat}><span style={S.statNum}>{spots.length}</span><span style={S.statLabel}>saved {spots.length === 1 ? "spot" : "spots"}</span></div>
          </div>
        </div>
      </section>

      <div style={S.main}>
        {/* Save form */}
        <form style={S.card} onSubmit={save}>
          <h3 style={S.cardTitle}>🅿️ Save a parking spot</h3>
          <div style={S.grid}>
            <Field label="Label" value={form.label} onChange={set("label")} placeholder="e.g. P1 Short Stay" />
            <Field label="Terminal" value={form.terminal} onChange={set("terminal")} placeholder="e.g. Departure Hall 2" />
            <Field label="Level" value={form.level} onChange={set("level")} placeholder="e.g. Level 3" />
            <Field label="Section / Zone" value={form.section} onChange={set("section")} placeholder="e.g. Zone B" />
            <Field label="Spot number" value={form.spot} onChange={set("spot")} placeholder="e.g. B-142" />
            <Field label="Note" value={form.note} onChange={set("note")} placeholder="e.g. near elevator" />
          </div>
          <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
            {saving ? "Saving..." : "Save parking"}
          </button>
        </form>

        {/* Saved list */}
        <h3 style={S.listTitle}>Your saved spots</h3>
        {loading ? (
          <div style={S.empty}>Loading…</div>
        ) : spots.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🚗</div>
            No saved parking yet — add one above.
          </div>
        ) : (
          <div style={S.spotGrid}>
            {spots.map((p) => (
              <div key={p._id} style={S.spotCard}>
                <div style={S.spotBar} />
                <div style={S.spotBody}>
                  <div style={S.spotLabel}>{p.label || "Parking spot"}</div>
                  {p.spot && <div style={S.spotBig}>{p.spot}</div>}
                  <div style={S.spotRows}>
                    {p.terminal && <span>📍 {p.terminal}</span>}
                    {p.level && <span>🏢 {p.level}</span>}
                    {p.section && <span>🅿️ {p.section}</span>}
                    {p.note && <span>📝 {p.note}</span>}
                  </div>
                  <div style={S.spotDate}>
                    Saved {new Date(p.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button style={S.removeBtn} onClick={() => remove(p._id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <input style={S.input} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

const S = {
  page: { background: "#fff", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  hero: { position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${PRIMARY} 0%, #001a42 100%)`, padding: "48px 24px 56px" },
  heroBg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 },
  heroOverlay: { position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(0,45,107,0.92) 0%, rgba(0,26,66,0.85) 100%)` },
  back: { position: "absolute", top: 18, left: 20, zIndex: 2, width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" },
  heroInner: { position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto" },
  eyebrow: { color: SECONDARY, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em" },
  title: { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "8px 0 6px" },
  sub: { color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", margin: 0 },
  heroStats: { display: "flex", gap: 20, marginTop: 18 },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { color: SECONDARY, fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginTop: 3 },
  main: { flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "0 24px 60px" },
  card: { background: "#fff", border: `1.5px solid ${SECONDARY}`, borderRadius: 16, padding: "24px", margin: "-28px 0 32px", boxShadow: "0 6px 24px rgba(0,45,107,0.08)" },
  cardTitle: { color: PRIMARY, fontWeight: 800, fontSize: "1.05rem", margin: "0 0 18px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 18 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: "0.78rem", color: "#6b7280", fontWeight: 600 },
  input: { border: `1.5px solid ${PRIMARY}`, borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem", outline: "none" },
  saveBtn: { background: PRIMARY, color: SECONDARY, border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" },
  listTitle: { color: PRIMARY, fontWeight: 800, fontSize: "1.1rem", margin: "0 0 16px", borderLeft: `4px solid ${SECONDARY}`, paddingLeft: 12 },
  empty: { textAlign: "center", color: "#9ca3af", padding: "50px 0", fontSize: "0.95rem" },
  spotGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 },
  spotCard: { background: "#fff", border: `1.5px solid ${SECONDARY}`, borderTop: "none", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" },
  spotBar: { height: 12, background: PRIMARY },
  spotBody: { padding: "16px 18px", flex: 1 },
  spotLabel: { fontSize: "0.72rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#9ca3af" },
  spotBig: { fontSize: "1.5rem", fontWeight: 800, color: PRIMARY, margin: "2px 0 10px" },
  spotRows: { display: "flex", flexDirection: "column", gap: 6, fontSize: "0.84rem", color: "#4b5563" },
  spotDate: { marginTop: 12, fontSize: "0.72rem", color: "#9ca3af" },
  removeBtn: { background: "#fff", color: "#dc2626", border: "none", borderTop: "1px solid #f1f5f9", padding: "11px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" },
};
