import '../style/Aboutus.css';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDollarSign, FaChartLine, FaMapMarkedAlt, FaWheelchair, FaCrown, FaShoppingBag } from "react-icons/fa";
import { openApk } from "../../config.js";

// ── Navbar ────────────────────────────────────────────────────
const PlaneIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

function SimpleNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ textDecoration: "none", cursor: "pointer" }}>
          <PlaneIcon size={28} color="#F5A623" />
          <span className="logo-text">Gate Buddy</span>
        </Link>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <Link to="/contact">Contact Us</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
        <div className="nav-actions">
          <button className="btn-primary nav-download" onClick={openApk}>Download App</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default function AboutSection() {
  const navigate = useNavigate();
  return (
    <>
      <SimpleNavbar />
      {/* 🔹 About Section */}
      <div className="about-container" style={{ paddingTop: "80px" }}>
        <div className="about-card">

          <div className="about-image-box">
            <img src="/images/img2.jpeg" alt="airport" />
          </div>

          <div className="about-text">
            <h2>About Us</h2>

            <h3>Smart Airport Experience</h3>
            <h4>All in One App</h4>

            <div className="line"></div>

            <p>
              We provide a smart application designed to improve the airport
              experience and make your journey easier and more comfortable.
            </p>

            <p>
              Our services help you navigate the airport smoothly from arrival
              to boarding with ease.
            </p>

            <div className="buttons">
              <button className="btn primary" onClick={() => navigate("/home")}>
                Explore Services
              </button>

              <button className="btn secondary" onClick={openApk}>
                Download App
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 🔹 Mission Section */}
      <section className="mission">
        <div className="mission-container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              

At Gate Buddy, we aim to bridge the gap between airports and passengers through a smart user-centric platform that makes travel easier and stress-free.




            </p>

            <ul>
              <li> Smart reminders for a smooth journey</li>
              <li>Innovating for the Future</li>
              <li> Precise airport navigation assistance</li>
              <li>Tailored commercial offers for passengers</li>
            </ul>
          </div>

          <div className="mission-images">
            <img src="/images/mission1.jpeg" alt="" className="img main" />
            <img src="/images/111.jpeg" className="img small top" />
            <img src="/images/111.jpeg" alt="" className="img small bottom" />
          </div>
        </div>
      </section>

      {/* 🔹 Vision Section */}
      <section className="mission">
        <div className="mission-container">

          <div className="mission-images">
            <img src="/images/vission1.jpeg" alt="" className="img main" />
            <img src="/images/111.jpeg" alt="" className="img small top" />
            <img src="/images/111.jpeg" alt="" className="img small bottom" />
          </div>

          <div className="mission-content">
            <h2>Our Vision</h2>
            <p>
              

To redefine the air travel experience by creating a world where no passenger ever feels lost, stressed, or uninformed within an airport.


            </p>

            <ul>
              <li>Fostering Sustainable Growth</li>
              <li> Seamless and stress-free airport journeys</li>
              <li> Smart guidance at every travel step</li>
              <li> Smart guidance at every travel step</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 🔥 NEW 🔥 Features Section */}
      <section className="features">
        <h2>What Makes Our App Special</h2>
        <p className="subtitle">
          We offer a comprehensive set of smart services designed to make your journey easier and more comfortable.
        </p>

        <div className="features-container">

          <div className="card">
            <div className="icon"><FaDollarSign /></div>
            <h3>Financial Services</h3>
            <p>A complete guide to ATMs and currency exchange inside the airport.</p>
            <ul>
              <li>✔ Exchange locations</li>
              <li>✔ Currency rates</li>
            </ul>
          </div>

          <div className="card">
            <div className="icon"><FaChartLine /></div>
            <h3>Real-Time Information</h3>
            <p>Get live updates about your flight and airport status.</p>
            <ul>
              <li>✔ Flight updates</li>
              <li>✔ Waiting times</li>
            </ul>
          </div>

          <div className="card">
            <div className="icon"><FaMapMarkedAlt /></div>
            <h3>Smart Navigation</h3>
            <p>Find your way easily inside the airport.</p>
            <ul>
              <li>✔ Indoor maps</li>
              <li>✔ Step-by-step guide</li>
            </ul>
          </div>

          <div className="card">
            <div className="icon"><FaWheelchair /></div>
            <h3>Accessibility</h3>
            <p>Support for passengers with special needs.</p>
            <ul>
              <li>✔ Personal assistance</li>
              <li>✔ Full facilities</li>
            </ul>
          </div>

          <div className="card">
            <div className="icon"><FaCrown /></div>
            <h3>VIP Experience</h3>
            <p>Premium services for a comfortable journey.</p>
            <ul>
              <li>✔ Private reception</li>
              <li>✔ VIP lounges</li>
            </ul>
          </div>

          <div className="card">
            <div className="icon"><FaShoppingBag /></div>
            <h3>Shopping Guide</h3>
            <p>Discover shops, cafés, and restaurants.</p>
            <ul>
              <li>✔ Menus & prices</li>
              <li>✔ Special offers</li>
            </ul>
          </div>

        </div>
      </section>
      {/* 🔥 Journey Timeline Section 🔥 */}
<section className="timeline">
   <h3>From start to end support</h3>

  <h2>Seamless Journey Management</h2>
  

  <div className="timeline-container">

    <div className="timeline-item left">
      <div className="icon"><FaMapMarkedAlt /></div>
      <div className="content">
        <h3>Arrival & Parking</h3>
        <p>Get clear directions to airport entrances and parking areas,
           with real-time guidance to help you arrive smoothly.</p>
      </div>
    </div>

    <div className="timeline-item right">
      <div className="icon"><FaChartLine /></div>
      <div className="content">
        <h3>Check-in Process</h3>
        <p>Easily find check-in counters and complete your procedures 
          with live updates on waiting times.</p>
      </div>
    </div>

    <div className="timeline-item left">
      <div className="icon"><FaWheelchair /></div>
      <div className="content">
        <h3>Security & Passport</h3>
        <p>Navigate smoothly through security and passport control.</p>
      </div>
    </div>

    <div className="timeline-item right">
      <div className="icon"><FaShoppingBag /></div>
      <div className="content">
        <h3>Shopping & Relax</h3>
        <p>Explore restaurants, cafés, and duty-free shops.</p>
      </div>
    </div>

    <div className="timeline-item left">
      <div className="icon"><FaCrown /></div>
      <div className="content">
        <h3>Boarding</h3>
        <p>Receive instant gate updates and directions to ensure you reach your
           flight on time without stress</p>
      </div>
    </div>

  </div>
</section>
<section className="why-us">
  <h2>Why Choose Our App?</h2>
  <p className="subtitle">
    We provide smart features that make your travel experience easier, faster, and more comfortable.
  </p>

  <div className="why-cards">

    <div className="why-card">
      <img src="/images/img666.jpg" alt="" />
      <h3>Save Time</h3>
      <p>
        Reduce your airport navigation time by up to 40% using smart guidance and real-time updates.
      </p>
    </div>

    <div className="why-card">
      <img src="/images/img666.jpg" alt="" />
      <h3>Less Stress</h3>
      <p>
        Get accurate information and clear directions to enjoy a smooth and stress-free journey.
      </p>
    </div>

    <div className="why-card">
      <img src="/images/img666.jpg" alt="" />
      <h3>Safer Journey</h3>
      <p>
        Receive instant alerts and helpful instructions to stay safe during every step of your trip.
      </p>
    </div>

  </div>

  {/* الجزء اللي تحت */}
  <div className="tech-section">

    <div className="tech-image">
      <img src="/images/mission.jpg" alt="" />
    </div>

    <div className="tech-content">
      <h2>Advanced Technology at Your Service</h2>
      <p>
        We use the latest technologies to ensure a smooth, secure, and intelligent travel experience.
      </p>

      <ul>
        <li>AI-powered smart recommendations</li>
        <li>High-performance cloud system</li>
        <li>Real-time updates and notifications</li>
        <li>Advanced data security protection</li>
      </ul>
    </div>

  </div>
</section>
<section className="values-section">

  {/* 🔹 Values */}
  <div className="values-box">
    <h2>Our Core Values</h2>
    <p className="subtitle">
      We are guided by a set of values that shape our work and define our identity.
    </p>

    <div className="values-cards">

      <div className="value-card">
        <div className="icon">🤝</div>
        <h3>Partnership</h3>
        <p>We build strong relationships with airports and partners.</p>
      </div>

      <div className="value-card">
        <div className="icon">🏅</div>
        <h3>Excellence</h3>
        <p>We strive for the highest quality in everything we do.</p>
      </div>

      <div className="value-card">
        <div className="icon">❤️</div>
        <h3>Customer Focus</h3>
        <p>Your satisfaction is always our top priority.</p>
      </div>

      <div className="value-card">
        <div className="icon">💡</div>
        <h3>Innovation</h3>
        <p>We continuously create smart and modern solutions.</p>
      </div>

    </div>
  </div>

  {/* 🔹 CTA */}
  <div className="cta-box">
    <h2>Start Your Smart Journey Today</h2>
    <p>
      Download the app now and enjoy a smarter travel experience like never before.
    </p>

    <div className="cta-buttons">
      <button onClick={openApk}>Google Play</button>
      <button onClick={openApk}>App Store</button>
    </div>

    <div className="cta-features">
      <span>✔ Full Protection</span>
      <span>✔ No Ads</span>
      <span>✔ Continuous Updates</span>
    </div>
  </div>

</section>
    </>
  );
}