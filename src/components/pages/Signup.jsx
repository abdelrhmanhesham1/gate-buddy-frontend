import '../style/Signup.css'; 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
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
  // مؤقت للتيست بدون backend
  localStorage.setItem('auth_token', 'test_token_123');
  localStorage.setItem('user_profile', JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    photo: "https://i.pravatar.cc/80?img=11"
  }));
  navigate("/home");
};
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setErr("Passwords do not match!");
    }
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      Swal.fire({ icon: "success", title: "Success!", text: "Account created successfully" });
      navigate("/login");
    } catch (error) {
      setErr(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }; */

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