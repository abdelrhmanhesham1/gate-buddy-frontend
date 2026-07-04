import '../style/Login.css';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { authAPI } from "../../../utils/Api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SocialAuthButtons from "../shared/SocialAuthButtons.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      const { token, data } = res.data;
      setSession(token, data.user);
      const first = data.user?.name ? `, ${data.user.name.split(" ")[0]}` : "";
      Swal.fire({
        icon: "success",
        title: `Welcome back${first}! ✈️`,
        text: "You're all set — enjoy your journey with Gate Buddy.",
        showConfirmButton: false,
        timer: 1600,
      });
      navigate("/home");
    } catch (error) {
      setErr(error.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="hero-text">
        <div className="main-logo-area">
          <img src="/images/logo.png" alt="Logo" className="hero-logo" />
          <h1>Gate Buddy</h1>
        </div>
        <p>your smart airport companion</p>
      </div>

      <div className="auth-card">

        <div className="welcome-section">
          <span className="plane-icon">✈</span>
          <div className="welcome-text">
            <h3>welcome Back</h3>
            <p>Login to access airport services</p>
          </div>
        </div>

        <hr className="divider" />
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email</label>
            <div className="custom-input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <div className="custom-input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye-icon">👁</span>
            </div>
          </div>

          {err && <div className="error-msg">{err}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/PasswordReset" className="PasswordReset">Forget password?</Link>

          <SocialAuthButtons onError={setErr} />

          <p className="signup-prompt">
            You don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>

      </div>
    </div>
  );
}
