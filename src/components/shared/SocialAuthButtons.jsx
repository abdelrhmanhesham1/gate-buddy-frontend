import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authAPI } from "../../../utils/Api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23li88HESnZEKNc5I5";
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "1186697809728981";

/**
 * Google / Facebook / GitHub sign-in buttons (OAuth auto-creates the account,
 * so this doubles as social sign-up). Self-styled so it works on any page.
 * `onError(msg)` bubbles failures up to the host form's error display.
 */
export default function SocialAuthButtons({ onError }) {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [socialLoading, setSocialLoading] = useState("");
  const setErr = (m) => onError && onError(m);

  const done = (res) => {
    setSession(res.data.token, res.data.data.user);
    Swal.fire({ icon: "success", title: "Welcome!", showConfirmButton: false, timer: 1200 });
    navigate("/home");
  };

  const handleGoogleSuccess = async (cred) => {
    setSocialLoading("google");
    try { done(await authAPI.googleLogin(cred.credential)); }
    catch (e) { setErr(e.response?.data?.message || "Google login failed. Please try again."); }
    finally { setSocialLoading(""); }
  };

  const handleGitHub = () => {
    const redirectUri = `${window.location.origin}/oauth/github`;
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}` +
      `&scope=user:email&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const handleFacebook = () => {
    setSocialLoading("facebook");
    const trigger = () =>
      window.FB.login(async (response) => {
        if (response.authResponse?.accessToken) {
          try { done(await authAPI.facebookLogin(response.authResponse.accessToken)); }
          catch (e) { setErr(e.response?.data?.message || "Facebook login failed. Please try again."); }
        } else {
          setErr("Facebook login was cancelled.");
        }
        setSocialLoading("");
      }, { scope: "public_profile,email" });

    if (!window.FB) {
      window.fbAsyncInit = () => {
        window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: "v19.0" });
        trigger();
      };
      const s = document.createElement("script");
      s.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(s);
    } else {
      trigger();
    }
  };

  return (
    <>
      <style>{`
        .sab-divider { text-align:center; margin:18px 0; position:relative; }
        .sab-divider span { background:#fff; padding:0 12px; color:#777; font-size:14px; position:relative; z-index:2; }
        .sab-divider::before { content:""; position:absolute; top:50%; left:0; width:100%; height:1px; background:#ddd; z-index:1; }
        .sab-list { display:flex; flex-direction:column; gap:12px; }
        .sab-btn { width:100%; border:1px solid #ddd; background:#fff; padding:10px; border-radius:12px; cursor:pointer; font-weight:600; display:flex; align-items:center; justify-content:center; gap:10px; transition:.3s; font-family:inherit; color:#333; }
        .sab-btn img { width:20px; height:20px; }
        .sab-btn:hover { background:#f7f7f7; transform:translateY(-2px); }
        .sab-btn:disabled { opacity:.6; cursor:not-allowed; }
      `}</style>

      <div className="sab-divider"><span>or continue with</span></div>

      <div className="sab-list">
        <div style={{ width: "100%" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErr("Google login failed.")}
            width="100%"
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <button type="button" className="sab-btn" onClick={handleFacebook} disabled={!!socialLoading}>
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          {socialLoading === "facebook" ? "Connecting..." : "Continue with Facebook"}
        </button>

        <button type="button" className="sab-btn" onClick={handleGitHub} disabled={!!socialLoading}>
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" />
          Continue with GitHub
        </button>
      </div>
    </>
  );
}
