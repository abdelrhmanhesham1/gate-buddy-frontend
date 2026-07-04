import { useState } from "react";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import "../style/Airline.css";

import { FaSearch } from "react-icons/fa";

// Real airline logos from the airline-logo CDN, keyed by IATA code (same source
// the flight data uses). Falls back to a favicon, then the app logo.
function logoFor(item) {
  if (item.iata) return `https://pics.avs.io/200/200/${item.iata}.png`;
  try {
    const host = new URL(item.website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=256`;
  } catch {
    return "/images/logo.png";
  }
}

const AIRLINES = [
  { name: "EgyptAir", iata: "MS", website: "https://www.egyptair.com" },
  { name: "Emirates", iata: "EK", website: "https://www.emirates.com" },
  { name: "Qatar Airways", iata: "QR", website: "https://www.qatarairways.com" },
  { name: "Turkish Airlines", iata: "TK", website: "https://www.turkishairlines.com" },
  { name: "KLM Royal Dutch Airlines", iata: "KL", website: "https://www.klm.com" },
  { name: "Lufthansa", iata: "LH", website: "https://www.lufthansa.com" },
  { name: "Air France", iata: "AF", website: "https://www.airfrance.com" },
  { name: "British Airways", iata: "BA", website: "https://www.britishairways.com" },
  { name: "Etihad Airways", iata: "EY", website: "https://www.etihad.com" },
  { name: "Saudia", iata: "SV", website: "https://www.saudia.com" },
  { name: "flydubai", iata: "FZ", website: "https://www.flydubai.com" },
  { name: "Air Arabia", iata: "G9", website: "https://www.airarabia.com" },
  { name: "Pegasus Airlines", iata: "PC", website: "https://www.flypgs.com" },
  { name: "Ryanair", iata: "FR", website: "https://www.ryanair.com" },
  { name: "easyJet", iata: "U2", website: "https://www.easyjet.com" },
  { name: "Wizz Air", iata: "W6", website: "https://www.wizzair.com" },
  { name: "Vueling", iata: "VY", website: "https://www.vueling.com" },
  { name: "Delta Air Lines", iata: "DL", website: "https://www.delta.com" },
  { name: "American Airlines", iata: "AA", website: "https://www.aa.com" },
  { name: "United Airlines", iata: "UA", website: "https://www.united.com" },
  { name: "JetBlue", iata: "B6", website: "https://www.jetblue.com" },
  { name: "Southwest Airlines", iata: "WN", website: "https://www.southwest.com" },
  { name: "Air Canada", iata: "AC", website: "https://www.aircanada.com" },
  { name: "Singapore Airlines", iata: "SQ", website: "https://www.singaporeair.com" },
  { name: "Thai Airways", iata: "TG", website: "https://www.thaiairways.com" },
  { name: "Malaysia Airlines", iata: "MH", website: "https://www.malaysiaairlines.com" },
  { name: "IndiGo", iata: "6E", website: "https://www.goindigo.in" },
  { name: "Oman Air", iata: "WY", website: "https://www.omanair.com" },
  { name: "Royal Jordanian", iata: "RJ", website: "https://www.rj.com" },
  { name: "Kuwait Airways", iata: "KU", website: "https://www.kuwaitairways.com" },
  { name: "Gulf Air", iata: "GF", website: "https://www.gulfair.com" },
  { name: "Middle East Airlines", iata: "ME", website: "https://www.mea.com.lb" },
  { name: "Flynas", iata: "XY", website: "https://www.flynas.com" },
];

export default function Airlines() {
  const [search, setSearch] = useState("");

  const filteredAirlines = AIRLINES.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="airlines-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <img src="/images/img444.jpg" alt="plane" className="hero-img" />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            Explore Airlines <br />
            <span>Operating at the Airport</span>
          </h1>

          <p>
            Discover and book flights with airlines operating at airport.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <h2 className="section-title">Airlines at the Airport</h2>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by airline name or destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {filteredAirlines.map((item) => (
            <div className="air-card" key={item.iata}>
              <img
                src={logoFor(item)}
                alt={item.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/logo.png"; }}
              />
              <h3>{item.name}</h3>

              <button onClick={() => window.open(item.website, "_blank")}>
                Book Ticket
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
