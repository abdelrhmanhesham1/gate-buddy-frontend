import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext.jsx";
import { userAPI } from "../../../utils/Api.js";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user: authUser, refreshUser, logout } = useAuth();

  const [user, setUser] = useState(
    authUser || {
      name: "Mostafa Emad",
      email: "mostafaemad@gmail.com",
      photo: "https://i.pravatar.cc/150?img=11",
    }
  );
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({ name: authUser.name || "", email: authUser.email || "" });
    } else {
      setFormData({ name: user.name, email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let payload;
      if (photoFile) {
        payload = new FormData();
        payload.append("name", formData.name);
        payload.append("photo", photoFile);
      } else {
        payload = { name: formData.name };
      }
      await userAPI.updateMe(payload);       // email is intentionally not sent (API ignores it)
      await refreshUser();
      Swal.fire({ icon: "success", title: "Saved!", text: "Profile updated successfully.", showConfirmButton: false, timer: 1500 });
      setTimeout(() => navigate("/profile"), 1600);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Update failed", text: e.response?.data?.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);                       // kept to upload on Save
    const reader = new FileReader();
    reader.onload = (ev) => setUser((u) => ({ ...u, photo: ev.target.result })); // instant preview
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "36px 20px" }}>
          <div style={{ display: "flex", gap: "0px", width: "100%", maxWidth: "1000px", border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>

            {/* ===== SIDEBAR ===== */}
            <div style={{
              width: "240px", minWidth: "240px", background: "#002D6B",
              borderRadius: "0", paddingBottom: "16px",
              display: "flex", flexDirection: "column", alignItems: "center",
              color: "white", overflow: "hidden"
            }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: 30, paddingBottom: 12 }}>
                <img src={user.photo} alt="profile" style={{ width: 105, height: 105, borderRadius: "50%", objectFit: "cover", border: "3px solid #EDB046" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 3 }}>{user.name}</div>
              <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.65)", marginBottom: 18 }}>{user.email}</div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 8,
                padding: "7px 22px", color: "white",
                fontSize: "0.82rem", fontWeight: 600, marginBottom: 20,
                background: "rgba(255,255,255,0.12)"
              }}>✏️ Edit Profile</div>

              <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)", marginBottom: 4 }} />
              <SidebarLink to="/home" icon={<PlaneIcon />} label="Tracked Flight" />
              <SidebarLink to="/home" icon={<ParkIcon />} label="Saved parking" />
              <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)", margin: "6px 0" }} />
              <SidebarLink to="/home" icon={<SettingsIcon />} label="Settings" />
              <SidebarLink to="/home" icon={<LangIcon />} label="Language" />
              <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)", margin: "6px 0" }} />
              <button onClick={handleLogout} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 28px", color: "#ff5c5c", background: "none",
                border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600
              }}>
                <LogoutIcon /> Log Out
              </button>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{ flex: 1, background: "white", padding: "32px 32px" }}>

              {/* Title */}
              <h2 style={{ color: "#002D6B", fontWeight: 700, fontSize: "1.35rem", marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                <EditIcon /> Edit Profile
              </h2>

              {/* Card with gold border */}
              <div style={{ border: "1.5px solid #EDB046", borderRadius: 14, padding: "28px 28px 24px 28px", marginBottom: 24 }}>

                {/* Photo row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 28 }}>
                  <img src={user.photo} alt="profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "3px solid #EDB046", flexShrink: 0 }} />
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, paddingTop: 16 }}>
                    <label htmlFor="photo-upload" style={{
                      background: "white", color: "#111", border: "2px solid #333",
                      borderRadius: 8, padding: "10px 22px", cursor: "pointer",
                      fontSize: "0.88rem", fontWeight: 700, display: "inline-block"
                    }}>
                      Change Photo
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                    <div style={{ fontSize: "0.75rem", color: "#aaa" }}>JPG or PNG, max 2MB</div>
                  </div>
                </div>

                {/* Full Name */}
                <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <label style={{ fontSize: "0.82rem", color: "#888", marginBottom: 7, fontWeight: 500, width: 360, display: "block" }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: 360, border: "1.5px solid #002D6B", borderRadius: 8,
                      padding: "11px 16px", fontSize: "0.9rem", color: "#1a1a1a",
                      outline: "none", background: "white", boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <label style={{ fontSize: "0.82rem", color: "#888", marginBottom: 7, fontWeight: 500, width: 360, display: "block" }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    title="Email cannot be changed"
                    style={{
                      width: 360, border: "1.5px solid #002D6B", borderRadius: 8,
                      padding: "11px 16px", fontSize: "0.9rem", color: "#6b7280",
                      outline: "none", background: "#f5f7fa", boxSizing: "border-box", cursor: "not-allowed"
                    }}
                  />
                </div>

              </div>

              {/* Cancel / Save — outside the card, bottom right */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={() => navigate("/profile")} style={{
                  background: "white", color: "#333", border: "1.5px solid #ccc",
                  borderRadius: 8, padding: "9px 26px", cursor: "pointer",
                  fontSize: "0.85rem", fontWeight: 600
                }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{
                  background: "#002D6B", color: "white", border: "none",
                  borderRadius: 8, padding: "9px 26px", cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "0.85rem", fontWeight: 700, opacity: saving ? 0.7 : 1
                }}>{saving ? "Saving..." : "Save Changes"}</button>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link to={to} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 28px", color: "white", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >{icon} {label}</Link>
  );
}

function EditIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="#EDB046"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
}
function PlaneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>;
}
function ParkIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" /></svg>;
}
function SettingsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>;
}
function LangIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff5c5c"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>;
}
