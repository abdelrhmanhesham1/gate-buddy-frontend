import { useState } from "react";
import '../style/PasswordReset.css';



// ── API helpers ───────────────────────────────────────────────
const API = "http://localhost:3001";

async function apiSendOTP(email) {
  const res  = await fetch(`${API}/api/send-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  });
  return res.json(); // { ok: true } or { ok: false, msg }
}

async function apiVerifyOTP(email, otp) {
  const res  = await fetch(`${API}/api/verify-otp`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, otp }),
  });
  return res.json(); // { valid: true } or { valid: false, msg }
}

// ── Logo ──────────────────────────────────────────────────────
// Put your logo at: public/logo.png
function Logo() {
  return (
    <div className="gb-logo">
      <img
        className="gb-logo__img"
        src="/images/logo.png"
        alt="Gate Buddy"
        onError={e => { e.currentTarget.style.visibility = "hidden"; }}
      />
      <div className="gb-logo__text">
        <span className="gb-logo__name">Gate Buddy</span>
        <span className="gb-logo__tagline">your smart airport companion</span>
      </div>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────
// Put your airport photo at: public/airport-bg.jpg
function Page({ children }) {
  return (
    <div className="gb-page">
      <img
        className="gb-bg"
        src="/images/airport-bg.jpg"
        alt=""
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
      <div className="gb-bg-tint" />
      <Logo />
      <div className="gb-stage">{children}</div>
    </div>
  );
}

// ── Step 1 — Forget password ──────────────────────────────────
function ForgotPassword({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  async function submit() {
    setError("");
    if (!email.trim())               return setError("Enter your email.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email.");

    setBusy(true);
    try {
      const data = await apiSendOTP(email);
      if (data.ok) {
        onNext(email);
      } else {
        setError(data.msg || "Failed to send code. Try again.");
      }
    } catch {
      setError("Cannot reach server. Make sure server.js is running.");
    }
    setBusy(false);
  }

  return (
    <div className="gb-card">
      <h2 className="gb-card-title">Forget password</h2>

      <p className="gb-field-label">Enter your email</p>
      <div className="gb-field">
        <span className="gb-field-icon">✉</span>
        <input
          className="gb-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
        />
      </div>

      {error && <p className="gb-err">{error}</p>}

      <button className="gb-btn" onClick={submit} disabled={busy}>
        {busy ? "Sending code…" : "Next"}
      </button>
    </div>
  );
}

// ── Step 2 — Get your code ────────────────────────────────────
function GetCode({ email, onNext, onBack }) {
  const [code,  setCode]  = useState("");
  const [error, setError] = useState("");
  const [ok,    setOk]    = useState(false);
  const [busy,  setBusy]  = useState(false);

  async function resend() {
    setError("");
    try {
      const data = await apiSendOTP(email);
      if (data.ok) { setOk(true); setTimeout(() => setOk(false), 4000); }
      else setError(data.msg || "Could not resend.");
    } catch {
      setError("Server unreachable.");
    }
  }

  async function submit() {
    setError("");
    if (!code.trim()) return setError("Enter the code.");
    setBusy(true);
    try {
      const data = await apiVerifyOTP(email, code);
      if (data.valid) { onNext(); }
      else setError(data.msg || "Wrong code. Try again.");
    } catch {
      setError("Server unreachable.");
    }
    setBusy(false);
  }

  return (
    <div className="gb-card">
      <h2 className="gb-card-title">Get your code</h2>
      <p className="gb-sent-hint">Code sent to <strong>{email}</strong></p>

      <p className="gb-field-label">Enter your code</p>
      <div className="gb-field">
        <input
          className="gb-input gb-input--code"
          type="text"
          placeholder="Enter your code"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={e => e.key === "Enter" && submit()}
        />
      </div>

      {error && <p className="gb-err">{error}</p>}
      {ok    && <p className="gb-ok">✅ Code resent to {email}!</p>}

      <button className="gb-btn gb-btn--outline" onClick={resend}>Resend code?</button>
      <button className="gb-btn" onClick={submit} disabled={busy}>
        {busy ? "Checking…" : "Next"}
      </button>
      <button className="gb-back" onClick={onBack}>← Back</button>
    </div>
  );
}

// ── Step 3 — Reset password ───────────────────────────────────
function ResetPassword({ onDone }) {
  const [pass,  setPass]  = useState("");
  const [conf,  setConf]  = useState("");
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  function submit() {
    setError("");
    if (!pass)            return setError("Enter a new password.");
    if (pass.length < 6)  return setError("At least 6 characters.");
    if (pass !== conf)    return setError("Passwords don't match.");
    setBusy(true);
    // Here you would call your backend to update the password in the DB
    setTimeout(() => { setBusy(false); onDone(); }, 700);
  }

  return (
    <div className="gb-card">
      <h2 className="gb-card-title">Reset password</h2>

      <p className="gb-field-label">Enter new password</p>
      <div className="gb-field">
        <span className="gb-field-icon">🔒</span>
        <input
          className="gb-input"
          type={showP ? "text" : "password"}
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button className="gb-eye" onClick={() => setShowP(!showP)}>
          {showP ? "🙈" : "👁"}
        </button>
      </div>

      <p className="gb-field-label">Confirm Password</p>
      <div className="gb-field">
        <span className="gb-field-icon">🔒</span>
        <input
          className="gb-input"
          type={showC ? "text" : "password"}
          placeholder="Confirm password"
          value={conf}
          onChange={e => setConf(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
        />
        <button className="gb-eye" onClick={() => setShowC(!showC)}>
          {showC ? "🙈" : "👁"}
        </button>
      </div>

      {error && <p className="gb-err">{error}</p>}

      <button className="gb-btn" onClick={submit} disabled={busy}>
        {busy ? "Saving…" : "Confirm"}
      </button>
    </div>
  );
}

// ── Step 4 — Done ─────────────────────────────────────────────
function Done({ onLogin }) {
  return (
    <div className="gb-card gb-card--center">
      <div className="gb-done-check">✅</div>
      <h2 className="gb-card-title">Password updated!</h2>
      <p className="gb-done-sub">Your password has been changed successfully.</p>
      <button className="gb-btn" onClick={onLogin}>Go to Login</button>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function PasswordResetFlow() {
  const [step,  setStep]  = useState(1);
  const [email, setEmail] = useState("");

  return (
    <Page>
      {step === 1 && (
        <ForgotPassword onNext={e => { setEmail(e); setStep(2); }} />
      )}
      {step === 2 && (
        <GetCode
          email={email}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ResetPassword onDone={() => setStep(4)} />
      )}
      {step === 4 && (
        <Done onLogin={() => { setStep(1); setEmail(""); }} />
      )}
    </Page>
  );
}
