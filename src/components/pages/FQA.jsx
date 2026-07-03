import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/main1.css";
import { faqAPI } from "../../../utils/Api.js";
import { openApk } from "../../config.js";

// ── Plane Icon ────────────────────────────────────────────────────────────────
const PlaneIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

// ── FAQ Data (fallback when the API is unavailable) ───────────────────────────
const DEFAULT_FAQS = [
  {
    question: "What is Gate Buddy?",
    answer: "Gate Buddy is your ultimate airport assistant, helping you track flights, navigate terminals, and access airport services easily.",
  },
  {
    question: "Can I use Gate Buddy in any airport?",
    answer: "Gate Buddy currently supports 85+ airports worldwide and we are continuously expanding our coverage to more airports.",
  },
  {
    question: "Does Gate Buddy work offline?",
    answer: "Some features like saved maps and downloaded flight info are available offline. Real-time updates require an internet connection.",
  },
  {
    question: "Is Gate Buddy free to use?",
    answer: "Gate Buddy offers a free plan with core features. A VIP plan is available for premium features like priority assistance and exclusive lounges.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team via Live Chat in the app, or by submitting a question through the form below.",
  },
];

// ── FAQ Navbar ────────────────────────────────────────────────────────────────
function FAQNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <PlaneIcon size={28} color="#EDB046" />
          <span className="logo-text">Gate Buddy</span>
        </div>
        <div className="nav-links">
          <a href="/#about">Home</a>
                    <a href="#contact us">Contact Us</a>

        </div>
        <div className="nav-actions">
          <button className="btn-primary nav-download" onClick={openApk}>Download App</button>
        </div>
      </div>
    </nav>
  );
}

// ── FAQ Page ──────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [faqData, setFaqData] = useState(DEFAULT_FAQS);

  useEffect(() => {
    let alive = true;
    faqAPI
      .getAll()
      .then((res) => {
        // GET /faqs nests the array under data.data
        const list = res.data?.data?.data || res.data?.data?.faqs || [];
        if (alive && list.length) {
          setFaqData(list.map((f) => ({ question: f.question, answer: f.answer })));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your question has been submitted!");
    setForm({ name: "", email: "", question: "" });
  };

  return (
    <div className="app">
      <FAQNavbar />

      <div className="faq-page">
        {/* ── FAQ Accordion Section ── */}
        <div className="faq-page-top">
          <div className="container">
            <div className="faq-title-row">
              <span className="faq-emoji">🧑‍💼</span>
              <h2 className="faq-heading">Frequently Asked Questions</h2>
            </div>

            <div className="faq-list">
              {faqData.map((item, i) => (
                <div
                  key={i}
                  className={`faq-item ${openIndex === i ? "open" : ""}`}
                  onClick={() => toggle(i)}
                >
                  <div className="faq-question">
                    <span>{item.question}</span>
                    <span className="faq-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {openIndex === i
                          ? <path d="M18 15l-6-6-6 6"/>
                          : <path d="M6 9l6 6 6-6"/>
                        }
                      </svg>
                    </span>
                  </div>
                  {openIndex === i && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ask Your Question Form ── */}
        <div className="faq-form-section">
          <div className="container">
            <div className="faq-form-title-row">
              <span>🔔</span>
              <h3>Ask Your Question</h3>
            </div>
            <p className="faq-form-sub">
              Didn't find your question? Send it to us below and we'll get back to you!
            </p>
            <div className="faq-form">
              <input
                className="faq-input"
                placeholder="Enter Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="faq-input"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="faq-input"
                placeholder="Enter Your Question ..."
                value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })}
              />
              <button className="faq-submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <PlaneIcon size={22} color="#EDB046" />
                <span>Gate Buddy</span>
              </div>
              <p>Your ultimate flight tracking and airport services companion.<br />Making travel easier, one flight at a time.</p>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <a href="#">Live Flight Board</a>
              <a href="#">Flight Tracking</a>
              <a href="#">Airport Services</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Live Chat</a>
              <a href="#">Report Issue</a>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#">FAQ</a>
              <a href="#">About Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
