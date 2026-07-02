import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE = "https://gate-buddy-backend-production-f6df.up.railway.app/api/v1";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Completing login...");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      setStatus("Login cancelled.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    axios
      .post(`${BASE}/users/github`, { code }, { withCredentials: true })
      .then((res) => {
        const { token, data } = res.data;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_profile", JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          photo: data.user.photo || "https://i.pravatar.cc/40",
          id: data.user._id,
        }));
        setStatus("Login successful! Redirecting...");
        navigate("/home");
      })
      .catch(() => {
        setStatus("Login failed. Redirecting back...");
        setTimeout(() => navigate("/login"), 1500);
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#f7f9fc", fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "white", borderRadius: 16, padding: "48px 40px",
        boxShadow: "0 8px 32px rgba(0,45,107,0.12)",
        textAlign: "center", maxWidth: 340,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #002D6B, #0047b3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <p style={{ color: "#002D6B", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
          Gate Buddy
        </p>
        <p style={{ color: "#6B7280", fontSize: "0.88rem", marginTop: 8 }}>{status}</p>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "#002D6B",
              display: "inline-block", opacity: 0.3,
              animation: `pulse 1.2s ${i * 0.2}s infinite ease-in-out`,
            }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
