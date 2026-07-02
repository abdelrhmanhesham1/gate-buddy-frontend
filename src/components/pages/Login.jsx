
import '../style/Login.css';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://gate-buddy-backend-production-f6df.up.railway.app/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
      const { token, data } = res.data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_profile", JSON.stringify({
        name: data.user.name,
        email: data.user.email,
        photo: data.user.photo || "https://i.pravatar.cc/40",
        id: data.user._id,
      }));
      Swal.fire({ icon: "success", title: "Welcome back!", showConfirmButton: false, timer: 1200 });
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
  {/* line */}
  <div className="or-divider">
    <span>or continue with</span>
  </div>

  {/* social login */}
  <div className="social-login">

    <button type="button" className="social-btn google-btn">
      <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />
      Continue with Google
    </button>

    <button type="button" className="social-btn facebook-btn">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" />
      Continue with Facebook
    </button>

    <button type="button" className="social-btn github-btn">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
      Continue with GitHub
    </button>

  </div>

  <p className="signup-prompt">
    You don't have an account? <Link to="/signup">Sign Up</Link>
  </p>

</form>
        
      </div>
    </div>
  );
}