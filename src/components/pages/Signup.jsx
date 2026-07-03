import '../style/Signup.css';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { authAPI } from "../../../utils/Api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SocialAuthButtons from "../shared/SocialAuthButtons.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setErr("Passwords do not match!");
    }
    setErr("");
    setLoading(true);
    try {
      // Note: the API user model has no `phone` field, so it is intentionally not sent.
      const res = await authAPI.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      const { token, data } = res.data;
      setSession(token, data.user);
      Swal.fire({ icon: "success", title: "Account created!", showConfirmButton: false, timer: 1200 });
      navigate("/home");
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed. Please try again.");
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

      <div className="auth-card ">
        <h2 style={{ color: '#0d3b66', fontWeight: '800', textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <div className="custom-input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                placeholder="User Name"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="custom-input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="custom-input-group">
              <span className="icon">📞</span>
              <input
                type="tel"
                placeholder="Phone Number"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="custom-input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="custom-input-group">
              <span className="icon">🛡️</span>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          {err && <div className="error-message" style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{err}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <SocialAuthButtons onError={setErr} />

          <div className="footer-links">
            <p className="signup-prompt">
              You already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}