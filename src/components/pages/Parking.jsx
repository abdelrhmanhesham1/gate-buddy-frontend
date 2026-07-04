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
      <style>{`
        .pk-ticket { transition: transform .2s, box-shadow .2s; }
        .pk-ticket:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,45,107,0.16); }
        .pk-input:focus { border-color: ${PRIMARY} !important; box-shadow: 0 0 0 3px rgba(0,45,107,0.08); }
        .pk-layout { display: grid; grid-template-columns: 380px 1fr; gap: 28px; align-items: start; }
        .pk-form-card { position: sticky; top: 90px; }
        @media (max-width: 860px) { .pk-layout { grid-template-columns: 1fr; } .pk-form-card { position: static; } }
      `}</style>
      <Navbar />

      {/* Hero */}
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
        <div className="pk-layout">
          {/* Save form */}
          <form className="pk-form-card" style={S.card} onSubmit={save}>
            <div style={S.cardHead}>
              <span style={S.cardHeadIcon}>🅿️</span>
              <div>
                <h3 style={S.cardTitle}>Save a spot</h3>
                <p style={S.cardHint}>Note your parking so you don't forget it.</p>
              </div>
            </div>
            <Field label="Label" value={form.label} onChange={set("label")} placeholder="P1 Short Stay" />
            <div style={S.two}>
              <Field label="Terminal" value={form.terminal} onChange={set("terminal")} placeholder="Hall 2" />
              <Field label="Level" value={form.level} onChange={set("level")} placeholder="Level 3" />
            </div>
            <div style={S.two}>
              <Field label="Section / Zone" value={form.section} onChange={set("section")} placeholder="Zone B" />
              <Field label="Spot" value={form.spot} onChange={set("spot")} placeholder="B-142" />
            </div>
            <Field label="Note" value={form.note} onChange={set("note")} placeholder="near the elevator" />
            <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? "Saving…" : "＋ Save parking"}
            </button>
          </form>

          {/* Saved tickets */}
          <div>
            <h3 style={S.listTitle}>Your saved spots</h3>
            {loading ? (
              <div style={S.empty}>Loading…</div>
            ) : spots.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize: "3rem", marginBottom: 10 }}>🅿️</div>
                <div style={{ fontWeight: 700, color: PRIMARY, marginBottom: 4 }}>No saved parking yet</div>
                <div style={{ fontSize: "0.88rem" }}>Add your first spot using the form.</div>
              </div>
            ) : (
              <div style={S.grid}>
                {spots.map((p) => (
                  <div key={p._id} className="pk-ticket" style={S.ticket}>
                    <div style={S.ticketTop}>
                      <span style={S.ticketBrand}>🅿️ PARKING</span>
                      <span style={S.ticketLabel}>{p.label || "Saved spot"}</span>
                    </div>
                    <div style={S.ticketBody}>
                      {p.spot ? (
                        <div style={S.spotBadge}>{p.spot}</div>
                      ) : (
                        <div style={{ ...S.spotBadge, fontSize: "0.9rem", letterSpacing: 0 }}>Spot saved</div>
                      )}
                      <div style={S.dashed} />
                      <div style={S.rows}>
                        {p.terminal && <div style={S.row}><span style={S.rowIcon}>📍</span>{p.terminal}</div>}
                        {p.level && <div style={S.row}><span style={S.rowIcon}>🏢</span>{p.level}</div>}
                        {p.section && <div style={S.row}><span style={S.rowIcon}>🅿️</span>{p.section}</div>}
                        {p.note && <div style={S.row}><span style={S.rowIcon}>📝</span>{p.note}</div>}
                      </div>
                      <div style={S.ticketDate}>
                        Saved {new Date(p.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <button style={S.removeBtn} onClick={() => remove(p._id)}>🗑 Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <input className="pk-input" style={S.input} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

const S = {
  page: { background: "#f6f8fc", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  hero: { position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${PRIMARY} 0%, #001a42 100%)`, padding: "48px 24px 56px" },
  heroBg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,45,107,0.92) 0%, rgba(0,26,66,0.85) 100%)" },
  back: { position: "absolute", top: 18, left: 20, zIndex: 2, width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" },
  heroInner: { position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto" },
  eyebrow: { color: SECONDARY, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em" },
  title: { color: "#fff", fontSize: "2rem", fontWeight: 800, margin: "8px 0 6px" },
  sub: { color: "rgba(255,255,255,0.8)", fontSize: "0.92rem", margin: 0 },
  heroStats: { display: "flex", gap: 20, marginTop: 18 },
  stat: { display: "flex", flexDirection: "column" },
  statNum: { color: SECONDARY, fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", marginTop: 3 },
  main: { flex: 1, maxWidth: 1100, width: "100%", margin: "-28px auto 0", padding: "0 24px 60px" },

  card: { background: "#fff", border: `1.5px solid ${SECONDARY}`, borderRadius: 18, padding: "22px", boxShadow: "0 8px 30px rgba(0,45,107,0.08)" },
  cardHead: { display: "flex", gap: 12, alignItems: "center", marginBottom: 18 },
  cardHeadIcon: { fontSize: "1.6rem", width: 44, height: 44, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" },
  cardTitle: { color: PRIMARY, fontWeight: 800, fontSize: "1.05rem", margin: 0 },
  cardHint: { color: "#8896b0", fontSize: "0.78rem", margin: "2px 0 0" },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  fieldLabel: { fontSize: "0.75rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { border: "1.5px solid #dbe2f0", borderRadius: 10, padding: "10px 12px", fontSize: "0.9rem", outline: "none", transition: "border-color .15s, box-shadow .15s" },
  two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  saveBtn: { width: "100%", marginTop: 6, background: PRIMARY, color: SECONDARY, border: "none", borderRadius: 10, padding: "13px", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer" },

  listTitle: { color: PRIMARY, fontWeight: 800, fontSize: "1.05rem", margin: "6px 0 16px", borderLeft: `4px solid ${SECONDARY}`, paddingLeft: 12 },
  empty: { textAlign: "center", color: "#9ca3af", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1.5px dashed #d4ddec" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 },

  ticket: { background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 3px 14px rgba(0,45,107,0.08)", border: "1px solid #e7ecf6", display: "flex", flexDirection: "column" },
  ticketTop: { background: PRIMARY, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 2 },
  ticketBrand: { color: SECONDARY, fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.15em" },
  ticketLabel: { color: "#fff", fontSize: "0.95rem", fontWeight: 700 },
  ticketBody: { padding: "16px 18px", flex: 1 },
  spotBadge: { display: "inline-block", background: "#EEF2FF", color: PRIMARY, fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.04em", padding: "6px 14px", borderRadius: 10, border: `1px dashed ${SECONDARY}` },
  dashed: { borderTop: "1.5px dashed #d4ddec", margin: "14px 0" },
  rows: { display: "flex", flexDirection: "column", gap: 7, fontSize: "0.84rem", color: "#4b5563" },
  row: { display: "flex", alignItems: "center", gap: 8 },
  rowIcon: { width: 16, textAlign: "center" },
  ticketDate: { marginTop: 12, fontSize: "0.72rem", color: "#9ca3af" },
  removeBtn: { background: "#fff", color: "#dc2626", border: "none", borderTop: "1px solid #f1f5f9", padding: "11px", fontWeight: 700, cursor: "pointer", fontSize: "0.83rem" },
};
