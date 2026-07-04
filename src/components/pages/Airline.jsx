import React, { useState } from "react";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import "../style/Airline.css";

import { FaSearch } from "react-icons/fa";

// Prefer a high-quality Wikimedia logo when we have one; otherwise fall back to
// a larger favicon (Clearbit's logo API was shut down). Falls back to the app logo.
function logoFor(item) {
  if (item.logo && item.logo.includes("wikimedia.org")) return item.logo;
  try {
    const host = new URL(item.website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${host}&sz=256`;
  } catch {
    return "/images/logo.png";
  }
}

export default function Airlines() {
  const [search, setSearch] = useState("");

  const airlines = [
    {
      name: "EgyptAir",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Egyptair_logo_%282010%29.svg/320px-Egyptair_logo_%282010%29.svg.png",
      website: "https://www.egyptair.com",
    },
    {
      name: "Emirates",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
      website: "https://www.emirates.com",
    },
    {
      name: "Qatar Airways",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Qatar_Logo.svg",
      website: "https://www.qatarairways.com",
    },
    {
      name: "Turkish Airlines",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Turkish_Airlines_logo_2019_compact.svg",
      website: "https://www.turkishairlines.com",
    },
    
  {
    name: "EgyptAir",
    logo: "https://logo.clearbit.com/egyptair.com",
    website: "https://www.egyptair.com",
  },
  {
    name: "Emirates",
    logo: "https://logo.clearbit.com/emirates.com",
    website: "https://www.emirates.com",
  },
  {
    name: "Qatar Airways",
    logo: "https://logo.clearbit.com/qatarairways.com",
    website: "https://www.qatarairways.com",
  },
  {
    name: "Turkish Airlines",
    logo: "https://logo.clearbit.com/turkishairlines.com",
    website: "https://www.turkishairlines.com",
  },

  {
    name: "Lufthansa",
    logo: "https://logo.clearbit.com/lufthansa.com",
    website: "https://www.lufthansa.com",
  },
  {
    name: "Air France",
    logo: "https://logo.clearbit.com/airfrance.com",
    website: "https://www.airfrance.com",
  },
  {
    name: "British Airways",
    logo: "https://logo.clearbit.com/britishairways.com",
    website: "https://www.britishairways.com",
  },
  {
    name: "KLM",
    logo: "https://logo.clearbit.com/klm.com",
    website: "https://www.klm.com",
  },
  {
    name: "Etihad Airways",
    logo: "https://logo.clearbit.com/etihad.com",
    website: "https://www.etihad.com",
  },
  {
    name: "Saudi Airlines",
    logo: "https://logo.clearbit.com/saudia.com",
    website: "https://www.saudia.com",
  },
  {
    name: "FlyDubai",
    logo: "https://logo.clearbit.com/flydubai.com",
    website: "https://www.flydubai.com",
  },
  {
    name: "Air Arabia",
    logo: "https://logo.clearbit.com/airarabia.com",
    website: "https://www.airarabia.com",
  },
  {
    name: "Pegasus Airlines",
    logo: "https://logo.clearbit.com/flypgs.com",
    website: "https://www.flypgs.com",
  },
  {
    name: "Ryanair",
    logo: "https://logo.clearbit.com/ryanair.com",
    website: "https://www.ryanair.com",
  },
  {
    name: "EasyJet",
    logo: "https://logo.clearbit.com/easyjet.com",
    website: "https://www.easyjet.com",
  },
  {
    name: "Delta Airlines",
    logo: "https://logo.clearbit.com/delta.com",
    website: "https://www.delta.com",
  },
  {
    name: "American Airlines",
    logo: "https://logo.clearbit.com/aa.com",
    website: "https://www.aa.com",
  },
  {
    name: "United Airlines",
    logo: "https://logo.clearbit.com/united.com",
    website: "https://www.united.com",
  },
  {
    name: "Singapore Airlines",
    logo: "https://logo.clearbit.com/singaporeair.com",
    website: "https://www.singaporeair.com",
  },
  {
    name: "Thai Airways",
    logo: "https://logo.clearbit.com/thaiairways.com",
    website: "https://www.thaiairways.com",
  },
  {
    name: "Malaysia Airlines",
    logo: "https://logo.clearbit.com/malaysiaairlines.com",
    website: "https://www.malaysiaairlines.com",
  },
  {
    name: "IndiGo",
    logo: "https://logo.clearbit.com/goindigo.in",
    website: "https://www.goindigo.in",
  },
  {
    name: "Air Canada",
    logo: "https://logo.clearbit.com/aircanada.com",
    website: "https://www.aircanada.com",
  },
  {
    name: "Alitalia",
    logo: "https://logo.clearbit.com/alitalia.com",
    website: "https://www.alitalia.com",
  },
  {
  name: "Oman Air",
  logo: "https://logo.clearbit.com/omanair.com",
  website: "https://www.omanair.com",
},
{
  name: "Royal Jordanian",
  logo: "https://logo.clearbit.com/rj.com",
  website: "https://www.rj.com",
},
{
  name: "Kuwait Airways",
  logo: "https://logo.clearbit.com/kuwaitairways.com",
  website: "https://www.kuwaitairways.com",
},
{
  name: "Gulf Air",
  logo: "https://logo.clearbit.com/gulfair.com",
  website: "https://www.gulfair.com",
},
{
  name: "Middle East Airlines",
  logo: "https://logo.clearbit.com/mea.com.lb",
  website: "https://www.mea.com.lb",
},
{
  name: "Flynas",
  logo: "https://logo.clearbit.com/flynas.com",
  website: "https://www.flynas.com",
},
{
  name: "Wizz Air",
  logo: "https://logo.clearbit.com/wizzair.com",
  website: "https://www.wizzair.com",
},
{
  name: "Vueling",
  logo: "https://logo.clearbit.com/vueling.com",
  website: "https://www.vueling.com",
},
{
  name: "JetBlue",
  logo: "https://logo.clearbit.com/jetblue.com",
  website: "https://www.jetblue.com",
},
{
  name: "Southwest Airlines",
  logo: "https://logo.clearbit.com/southwest.com",
  website: "https://www.southwest.com",
},
];
  

  // Remove duplicate airlines (the list has repeats), then filter by search.
  const uniqueAirlines = airlines.filter(
    (a, i, arr) => arr.findIndex((x) => x.name.toLowerCase() === a.name.toLowerCase()) === i
  );
  const filteredAirlines = uniqueAirlines.filter((item) =>
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
          {filteredAirlines.map((item, index) => (
            <div className="air-card" key={index}>
              <img
                src={logoFor(item)}
                alt={item.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/logo.png"; }}
              />
              <h3>{item.name}</h3>

              <button
                onClick={() => window.open(item.website, "_blank")}
              >
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