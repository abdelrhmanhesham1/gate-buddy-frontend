import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main1 from "./components/pages/main1.jsx";
import FAQ from "./components/pages/FQA.jsx";
import Login from "./components/pages/Login.jsx";
import Signup from "./components/pages/Signup.jsx";
import Home from "./components/pages/Home.jsx";
import Aboutus from "./components/pages/Aboutus.jsx";
import Contact from "./components/pages/Contact.jsx";
import AScan from "./components/pages/A_Scan.jsx";
import Explore from "./components/pages/explore.jsx";
import CounterS from "./components/pages/Counter_S.jsx";
import VipS from "./components/pages/Vip_S.jsx";
import AccessabillityS from "./components/pages/Accessabillity_S.jsx";
import Chatbot from "./components/pages/Chatbot.jsx";
import FinancialS from "./components/pages/Financial_S.jsx";
import Airline from "./components/pages/Airline.jsx";
import Hotels from "./components/pages/Hotel.jsx";
import Map from "./components/pages/Map.jsx";
import Profile from "./components/pages/Profile.jsx";
import EditProfile from "./components/pages/EditProfile.jsx";
import PasswordReset from"./components/pages/PasswordReset.jsx";
import OAuthCallback from "./components/pages/OAuthCallback.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Main1 />} />
        <Route path="/main1" element={<Main1 />} />
         <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/faq" element={<FAQ />} />
         <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/Airline" element={<Airline />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/Hotels" element={<Hotels />} />
        <Route path="/PasswordReset" element={<PasswordReset />}/>
        <Route path="/oauth/github" element={<OAuthCallback />}/>

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><AScan /></ProtectedRoute>} />
        <Route path="/counters" element={<ProtectedRoute><CounterS /></ProtectedRoute>} />
        <Route path="/vip" element={<ProtectedRoute><VipS /></ProtectedRoute>} />
        <Route path="/accessibility" element={<ProtectedRoute><AccessabillityS /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/financial" element={<ProtectedRoute><FinancialS /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default App;