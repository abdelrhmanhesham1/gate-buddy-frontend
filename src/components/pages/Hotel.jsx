import React, { useState } from "react";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import "../style/Hotel.css";

const hotelsData = [
  {
    id: 1,
    name: "Le Méridien Cairo Airport",
    desc: "Connected to Terminal 3",
    price: 150,
    distance: 0,
    url: "https://www.marriott.com/en-us/hotels/caieg-le-meridien-cairo-airport",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&w=600",
  },
  {
    id: 2,
    name: "Novotel Cairo Airport",
    desc: "5 min from the airport",
    price: 120,
    distance: 5,
    url: "https://all.accor.com/hotel/7425/index.en.shtml",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&w=600",
  },
  {
    id: 3,
    name: "Hilton Cairo Heliopolis",
    desc: "10 min from the airport",
    price: 180,
    distance: 10,
    url: "https://www.hilton.com",
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&w=600",
  },
  {
    id: 4,
    name: "Ramses Hilton",
    desc: "Downtown Cairo view",
    price: 160,
    distance: 20,
    url: "https://www.hilton.com",
    img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&w=600",
  },
  {
    id: 5,
    name: "Fairmont Nile City",
    desc: "Luxury Nile view",
    price: 220,
    distance: 18,
    url: "https://www.fairmont.com",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&w=600",
  },
  {
    id: 6,
    name: "InterContinental Citystars",
    desc: "Shopping mall connected",
    price: 200,
    distance: 12,
    url: "https://www.ihg.com",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&w=600",
  },
];

export default function HotelsUI() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const filteredHotels = hotelsData
    .filter((hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "distance") return a.distance - b.distance;
      return 0;
    });

  return (
    <>
      <Navbar />

      <div className="hotel-page">
        <div className="hotel-container">

          <div className="hotel-hero">
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>Find Hotels</h1>
                <h2>Near Cairo Airport</h2>
                <p>
                  Discover and book the best hotels operating near the airport
                  with comfort, speed, and easy access to your terminal.
                </p>
              </div>
            </div>
          </div>

          <div className="hotel-filters">
            <input
              type="text"
              placeholder="Search hotel name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={() => setSort("price")}>Sort by Price</button>
            <button onClick={() => setSort("distance")}>Sort by Distance</button>
            <button onClick={() => setSort("")}>Reset</button>
          </div>

          {filteredHotels.map((hotel) => (
            <div className="hotel-card" key={hotel.id}>
              <img
                src={hotel.img}
                alt={hotel.name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/142.jpg"; }}
              />

              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p>{hotel.desc}</p>
                <span>${hotel.price} per night</span>
              </div>

              <button
                className="hotel-btn"
                onClick={() => window.open(hotel.url, "_blank")}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}