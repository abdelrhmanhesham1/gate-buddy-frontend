import '../style/Contact.css';
import { useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_PUBLIC) {
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
          { publicKey: EMAILJS_PUBLIC }
        );
      }
      alert("Message sent successfully ✅");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      alert("Sorry, your message could not be sent. Please try again or email gatebuddy11@gmail.com");
    } finally {
      setSending(false);
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

      {/* الكارد الجديد */}
      <div className="auth-card contact-card">

        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          Have questions or feedback? Fill out the form to get in touch with us!
        </p>

        <div className="contact-options">
          <button type="button" className="active">💬 Live chat</button>
          <button type="button">✉ Email Us</button>
          <button type="button">📞 Call Us</button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-box">
            <span>👤</span>
            <input type="text" placeholder="Full Name" value={form.name} onChange={set("name")} required />
          </div>

          <div className="input-box">
            <span>✉</span>
            <input type="email" placeholder="Email Address" value={form.email} onChange={set("email")} required />
          </div>

          <div className="input-box">
            <span>📄</span>
            <input type="text" placeholder="Subject" value={form.subject} onChange={set("subject")} required />
          </div>

          <div className="input-box textarea">
            <span>💬</span>
            <textarea placeholder="Message" value={form.message} onChange={set("message")} required></textarea>
          </div>

          <button className="send-btn" disabled={sending}>
            {sending ? "Sending..." : "Send Message ➜"}
          </button>

        </form>
      </div>
    </div>
  );
}
