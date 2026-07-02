import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Russian" },
  { code: "ar", label: "Arabic" },
  { code: "es", label: "Spanish" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [view, setView] = useState("profile"); // "profile" | "settings" | "language"

  const [user, setUser] = useState({
    name: "Mostafa Emad",
    email: "mostafaemad@gmail.com",
    photo: "https://i.pravatar.cc/150?img=11",
  });

  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Language state
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("app_language") || "en"
  );
  const [tempLang, setTempLang] = useState(selectedLang);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_profile");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePasswordUpdate = () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordData.newPass.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    setPasswordSuccess("Password updated successfully!");
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordData({ current: "", newPass: "", confirm: "" });
      setPasswordSuccess("");
    }, 1500);
  };

  const handleSaveLanguage = () => {
    setSelectedLang(tempLang);
    localStorage.setItem("app_language", tempLang);
    setView("settings");
  };

  const openLanguage = () => {
    setTempLang(selectedLang);
    setView("language");
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "36px 20px" }}>
          <div style={{ display: "flex", width: "100%", maxWidth: "1000px", border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>

            {/* ===== SIDEBAR ===== */}
            <div style={{
              width: "240px", minWidth: "240px", background: "#002D6B",
              display: "flex", flexDirection: "column", alignItems: "center",
              color: "white", paddingBottom: 16
            }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: 30, paddingBottom: 12 }}>
                <img src={user.photo} alt="profile" style={{ width: 105, height: 105, borderRadius: "50%", objectFit: "cover", border: "3px solid #EDB046" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 3 }}>{user.name}</div>
              <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.65)", marginBottom: 18 }}>{user.email}</div>

              <Link to="/edit-profile" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8,
                padding: "7px 22px", color: "white", textDecoration: "none",
                fontSize: "0.82rem", fontWeight: 600, marginBottom: 20
              }}>✏️ Edit Profile</Link>

              <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)", marginBottom: 4 }} />

              <SidebarBtn icon={<PlaneIcon />} label="Tracked Flight" active={false} onClick={() => navigate("/home")} />
              <SidebarBtn icon={<ParkIcon />} label="Saved parking" active={false} onClick={() => navigate("/home")} />

              <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.15)", margin: "6px 0" }} />

              <SidebarBtn icon={<SettingsIcon />} label="Settings" active={view === "settings"} onClick={() => setView("settings")} />
              <SidebarBtn icon={<LangIcon />} label="Language" active={view === "language"} onClick={() => { setTempLang(selectedLang); setView("language"); }} />

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

              {/* ---------- PROFILE VIEW ---------- */}
              {view === "profile" && (
                <>
                  <h2 style={{ color: "#002D6B", fontWeight: 700, fontSize: "1.35rem", marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                    <PersonIcon /> Profile
                  </h2>

                  <div style={{ border: "1.5px solid #EDB046", borderRadius: 14, padding: "28px 28px 24px 28px", marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 28 }}>
                      <img src={user.photo} alt="profile" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "3px solid #EDB046", flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, paddingTop: 16 }}>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <button style={{ background: "white", color: "#111", border: "2px solid #333", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                            Change Photo
                          </button>
                          <Link to="/edit-profile" style={{ background: "white", color: "#EDB046", border: "2px solid #EDB046", borderRadius: 8, padding: "10px 22px", fontSize: "0.88rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                            ✏️ Edit Profile
                          </Link>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 2 }}>JPG or PNG, max 2MB</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#888", marginBottom: 7, fontWeight: 500, width: 360 }}>Full Name</label>
                      <div style={{ border: "1.5px solid #002D6B", borderRadius: 8, padding: "12px 16px", fontSize: "0.92rem", color: "#1a1a1a", width: 360 }}>
                        {user.name}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#888", marginBottom: 7, fontWeight: 500, width: 360 }}>Email</label>
                      <div style={{ border: "1.5px solid #002D6B", borderRadius: 8, padding: "12px 16px", fontSize: "0.92rem", color: "#1a1a1a", width: 360 }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ---------- SETTINGS VIEW ---------- */}
              {view === "settings" && (
                <>
                  <h2 style={{ color: "#002D6B", fontWeight: 700, fontSize: "1.35rem", marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                    <SettingsIcon color="#EDB046" size={22} /> Settings
                  </h2>

                  {/* General */}
                  <div style={{ border: "1.5px solid #EDB046", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a1a", marginBottom: 18 }}>General</div>

                    {/* Dark Mode */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span>🌙</span>
                        <span style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Dark mode</span>
                      </div>
                      <div onClick={() => setDarkMode(!darkMode)} style={{ width: 46, height: 24, borderRadius: 12, cursor: "pointer", background: darkMode ? "#EDB046" : "#ccc", position: "relative", transition: "background 0.2s" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: darkMode ? 24 : 4, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      </div>
                    </div>

                    {/* Language */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span>🌐</span>
                        <span style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Language</span>
                      </div>
                      <button onClick={openLanguage} style={{ display: "flex", alignItems: "center", gap: 4, color: "#002D6B", fontSize: "0.85rem", fontWeight: 600, background: "#f0f4ff", padding: "5px 14px", borderRadius: 8, border: "1px solid #dce4f5", cursor: "pointer" }}>
                        {LANGUAGES.find(l => l.code === selectedLang)?.label} ›
                      </button>
                    </div>

                    {/* Help & Support */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span>🔒</span>
                        <span style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Help & Support</span>
                      </div>
                      <a href="mailto:support@gatebuddy.com" style={{ display: "flex", alignItems: "center", gap: 4, color: "#002D6B", fontSize: "0.85rem", fontWeight: 600, background: "#f0f4ff", padding: "5px 14px", borderRadius: 8, border: "1px solid #dce4f5", textDecoration: "none" }}>
                        Contact ›
                      </a>
                    </div>
                  </div>

                  {/* Account & Security */}
                  <div style={{ border: "1.5px solid #EDB046", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a1a", marginBottom: 18 }}>Account & Security</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span>🔒</span>
                        <span style={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}>Change Password</span>
                      </div>
                      <button onClick={() => setShowPasswordModal(true)} style={{ background: "white", color: "#002D6B", border: "2px solid #002D6B", borderRadius: 8, padding: "6px 20px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div style={{ border: "1.5px solid #ff4444", borderRadius: 14, padding: "20px 28px", background: "#fff8f8" }}>
                    <div style={{ color: "#ff4444", fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>⚠ Danger zone</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "0.82rem", color: "#555", margin: 0 }}>Deleting your account is permanent and cannot be undone.</p>
                      <button onClick={() => setShowDeleteConfirm(true)} style={{ background: "white", color: "#ff4444", border: "2px solid #ff4444", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 16 }}>
                        Delete Account 🗑
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ---------- LANGUAGE VIEW ---------- */}
              {view === "language" && (
                <>
                  <h2 style={{ color: "#002D6B", fontWeight: 700, fontSize: "1.35rem", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    🌐 Language
                  </h2>
                  <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: 28 }}>Select your preferred language</p>

                  <div style={{ border: "1.5px solid #EDB046", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
                    {LANGUAGES.map((lang, i) => (
                      <div key={lang.code} onClick={() => setTempLang(lang.code)} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "15px 24px", cursor: "pointer",
                        background: tempLang === lang.code ? "#002D6B" : "white",
                        color: tempLang === lang.code ? "white" : "#1a1a1a",
                        borderBottom: i < LANGUAGES.length - 1 ? "1px solid #f0f0f0" : "none",
                        fontWeight: tempLang === lang.code ? 700 : 500,
                        fontSize: "0.92rem", transition: "background 0.15s"
                      }}>
                        {lang.label}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={tempLang === lang.code ? "white" : "#ccc"}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button onClick={() => setView("settings")} style={{ background: "white", color: "#333", border: "2px solid #ccc", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveLanguage} style={{ background: "#002D6B", color: "white", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700 }}>
                      Save Changes
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* ===== CHANGE PASSWORD MODAL ===== */}
      {showPasswordModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 32, width: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <h3 style={{ color: "#002D6B", marginBottom: 20, fontSize: "1.1rem" }}>Change Password</h3>
            <label style={labelStyle}>Current Password</label>
            <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} style={inputStyle} placeholder="Enter current password" />
            <label style={labelStyle}>New Password</label>
            <input type="password" value={passwordData.newPass} onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} style={inputStyle} placeholder="Enter new password" />
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} style={inputStyle} placeholder="Confirm new password" />
            {passwordError && <div style={{ color: "#ff4444", fontSize: "0.8rem", marginBottom: 10 }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ color: "green", fontSize: "0.8rem", marginBottom: 10 }}>{passwordSuccess}</div>}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => { setShowPasswordModal(false); setPasswordError(""); setPasswordData({ current: "", newPass: "", confirm: "" }); }} style={{ background: "white", border: "2px solid #ccc", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={handlePasswordUpdate} style={{ background: "#002D6B", color: "white", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 32, width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <h3 style={{ color: "#ff4444", marginBottom: 12 }}>Delete Account?</h3>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: 24 }}>This action is permanent and cannot be undone. All your data will be lost.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ background: "white", border: "2px solid #ccc", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDeleteAccount} style={{ background: "#ff4444", color: "white", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ===== STYLES =====
const inputStyle = { display: "block", width: "100%", border: "1.5px solid #002D6B", borderRadius: 8, padding: "10px 14px", fontSize: "0.88rem", marginBottom: 14, marginTop: 4, boxSizing: "border-box", outline: "none" };
const labelStyle = { fontSize: "0.8rem", color: "#888", fontWeight: 500 };

// ===== SIDEBAR BUTTON =====
function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12,
      padding: "10px 28px", color: "white", background: active ? "rgba(255,255,255,0.12)" : "transparent",
      border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 500, textAlign: "left"
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background = active ? "rgba(255,255,255,0.12)" : "transparent"}
    >{icon} {label}</button>
  );
}

// ===== ICONS =====
function PersonIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="#EDB046"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>;
}
function PlaneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>;
}
function ParkIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" /></svg>;
}
function SettingsIcon({ color = "white", size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>;
}
function LangIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff5c5c"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>;
}