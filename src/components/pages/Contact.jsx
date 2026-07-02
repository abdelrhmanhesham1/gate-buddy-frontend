import '../style/Contact.css';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";;

export default function Contact() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully ✅");
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
            <input type="text" placeholder="Full Name" required />
          </div>

          <div className="input-box">
            <span>✉</span>
            <input type="email" placeholder="Email Address" required />
          </div>

          <div className="input-box">
            <span>📄</span>
            <input type="text" placeholder="Subject" required />
          </div>

          <div className="input-box textarea">
            <span>💬</span>
            <textarea placeholder="Message" required></textarea>
          </div>

          <button className="send-btn">
            Send Message ➜
          </button>

        </form>
      </div>
    </div>
  );
}