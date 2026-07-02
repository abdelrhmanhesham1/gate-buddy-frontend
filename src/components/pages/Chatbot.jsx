import { useState, useRef, useEffect } from "react";
import Navbar from "../shared/Navbar.jsx";
import Footer from "../shared/Footer.jsx";
import { chatAPI } from "../../../utils/Api.js";

const PRIMARY = "#002D6B";
const SECONDARY = "#EDB046";
const SEC_LIGHT = "#FFF8EC";

// ── Icons ─────────────────────────────────────────────────────────────────────
const BotAvatar = () => (
  <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
    <rect x="8" y="16" width="48" height="36" rx="10" fill={PRIMARY}/>
    <circle cx="22" cy="32" r="5" fill="white"/>
    <circle cx="42" cy="32" r="5" fill="white"/>
    <circle cx="22" cy="32" r="2.5" fill={SECONDARY}/>
    <circle cx="42" cy="32" r="2.5" fill={SECONDARY}/>
    <path d="M22 44 Q32 50 42 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <rect x="4" y="28" width="5" height="14" rx="2.5" fill={PRIMARY}/>
    <rect x="55" y="28" width="5" height="14" rx="2.5" fill={PRIMARY}/>
    <rect x="24" y="10" width="16" height="10" rx="3" fill={PRIMARY}/>
    <rect x="30" y="8" width="4" height="8" rx="2" fill={PRIMARY}/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlaneSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={SECONDARY}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const SUGGESTIONS = [
  { label: "🗺️ Gate B7 location", q: "Where is Gate B7?" },
  { label: "✈️ Flight EG204 status", q: "Flight status EG204" },
  { label: "🍽️ Nearest restaurant", q: "Nearest restaurant" },
  { label: "📦 Lost & Found", q: "Lost & Found" },
  { label: "💱 Currency exchange", q: "Currency exchange" },
  { label: "🛋️ VIP lounge", q: "VIP lounge access" },
];


const TypingDots = () => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
    {[0,1,2].map(i => (
      <span key={i} style={{
        width: 7, height: 7, borderRadius: "50%",
        background: PRIMARY, opacity: 0.4,
        animation: `cbDot 1.2s ${i*0.2}s infinite ease-in-out`,
        display: "inline-block"
      }}/>
    ))}
  </span>
);

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    id: 1, role: "bot",
    text: "Hi! I'm Gate Buddy 👋 Your AI assistant for Nile International Airport. How can I help you today?",
    time: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    const userMsg = { id: Date.now(), role: "user", text: trimmed, time: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build history from last 4 exchanges (8 messages)
    const history = messages.slice(-8).map(m => ({
      role: m.role === "bot" ? "assistant" : "user",
      text: m.text,
    }));

    try {
      const res = await chatAPI.sendMessage(trimmed, history);
      const reply = res.data?.data?.reply || "I'm here to help! Ask me about gates, flights, restaurants, or any airport service. ✈️";
      setMessages(p => [...p, { id: Date.now() + 1, role: "bot", text: reply, time: new Date() }]);
    } catch {
      setMessages(p => [...p, { id: Date.now() + 1, role: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again. ✈️", time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const fmt = d => d.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @keyframes cbDot {
          0%,80%,100% { transform:scale(.6); opacity:.3 }
          40% { transform:scale(1); opacity:1 }
        }
        @keyframes cbIn {
          from { opacity:0; transform:translateY(10px) }
          to   { opacity:1; transform:translateY(0) }
        }
        * { box-sizing: border-box; }
        .cb-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* ── PAGE HEADER ─────────────────────────── */
        .cb-header {
          background: ${PRIMARY};
          padding: 32px 24px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cb-header::after {
          content: "";
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 32px;
          background: #ffffff;
          border-radius: 32px 32px 0 0;
        }
        .cb-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(237,176,70,0.18);
          border: 1px solid rgba(237,176,70,0.4);
          border-radius: 999px;
          padding: 4px 14px;
          font-size: 0.72rem;
          font-weight: 600;
          color: ${SECONDARY};
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .cb-header-icon-wrap {
          width: 72px; height: 72px;
          background: white;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        }
        .cb-header h1 {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
        }
        .cb-header p {
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          margin: 0;
        }
        /* floating decorative dots */
        .cb-dot-dec {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        /* ── MAIN CONTENT ────────────────────────── */
        .cb-main {
          flex: 1;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 0 20px 32px;
        }

        /* ── SUGGESTIONS ─────────────────────────── */
        .cb-sugg-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #8899BB;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 24px 0 10px;
        }
        .cb-sugg-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .cb-sugg-btn {
          background: white;
          border: 1.5px solid ${SECONDARY};
          color: ${PRIMARY};
          font-size: 0.8rem;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .cb-sugg-btn:hover {
          background: ${SECONDARY};
          color: white;
          border-color: ${SECONDARY};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(237,176,70,0.3);
        }

        /* ── CHAT CARD ───────────────────────────── */
        .cb-card {
          background: white;
          border-radius: 20px;
          border: 1.5px solid ${SECONDARY};
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,45,107,0.08);
        }
        .cb-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          background: ${PRIMARY};
          border-bottom: 2px solid ${SECONDARY};
        }
        .cb-card-avatar {
          width: 36px; height: 36px;
          background: white;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cb-card-title {
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          margin: 0;
        }
        .cb-card-sub {
          color: rgba(255,255,255,0.65);
          font-size: 0.75rem;
          margin: 0;
        }
        .cb-online-dot {
          width: 8px; height: 8px;
          background: #4ade80;
          border-radius: 50%;
          margin-left: auto;
          box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.3) }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0.1) }
        }

        /* ── MESSAGES ────────────────────────────── */
        .cb-msgs {
          padding: 20px;
          min-height: 300px;
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }
        .cb-msgs::-webkit-scrollbar { width: 4px }
        .cb-msgs::-webkit-scrollbar-track { background: transparent }
        .cb-msgs::-webkit-scrollbar-thumb { background: #E0E8F0; border-radius: 4px }

        .cb-row {
          display: flex;
          gap: 10px;
          animation: cbIn 0.25s ease;
        }
        .cb-row.user { flex-direction: row-reverse; }

        .cb-av {
          width: 34px; height: 34px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; align-self: flex-end;
        }
        .cb-av.bot { background: #EEF3FF; border: 1.5px solid #D0DCFF; }
        .cb-av.user { background: ${SECONDARY}; }

        .cb-bubble-wrap { display: flex; flex-direction: column; max-width: 72%; }
        .cb-row.user .cb-bubble-wrap { align-items: flex-end; }

        .cb-bubble {
          padding: 11px 15px;
          border-radius: 16px;
          font-size: 0.875rem;
          line-height: 1.55;
          white-space: pre-line;
        }
        .cb-bubble.bot {
          background: #F0F4FF;
          color: #1a2a4a;
          border-bottom-left-radius: 4px;
          border: 1px solid #E0E8FF;
        }
        .cb-bubble.user {
          background: ${PRIMARY};
          color: white;
          border-bottom-right-radius: 4px;
        }
        .cb-time {
          font-size: 0.67rem;
          color: #AABBCC;
          margin-top: 4px;
          padding: 0 2px;
        }

        .cb-typing-row {
          display: flex; gap: 10px;
          animation: cbIn 0.25s ease;
        }
        .cb-typing-bubble {
          background: #F0F4FF;
          border: 1px solid #E0E8FF;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          padding: 13px 16px;
        }

        /* ── INPUT ───────────────────────────────── */
        .cb-input-area {
          padding: 14px 16px;
          border-top: 1.5px solid #F0F0F0;
          display: flex;
          gap: 10px;
          align-items: center;
          background: white;
        }
        .cb-input {
          flex: 1;
          border: 1.5px solid #E8EEF8;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 0.875rem;
          font-family: inherit;
          color: #1a2a4a;
          outline: none;
          transition: border-color 0.2s;
          background: #FAFBFF;
        }
        .cb-input:focus { border-color: ${PRIMARY}; background: white; }
        .cb-input::placeholder { color: #B0BFCC; }
        .cb-send {
          width: 42px; height: 42px;
          background: ${PRIMARY};
          border: none;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .cb-send:hover:not(:disabled) {
          background: #003d8f;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,45,107,0.3);
        }
        .cb-send:disabled { background: #C5D0E0; cursor: not-allowed; }

        /* ── FOOTER NOTE ─────────────────────────── */
        .cb-note {
          text-align: center;
          font-size: 0.73rem;
          color: #9AAABB;
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        @media (max-width: 600px) {
          .cb-header h1 { font-size: 1.25rem; }
          .cb-bubble { max-width: 85%; font-size: 0.83rem; }
          .cb-main { padding: 0 14px 24px; }
        }
      `}</style>

      <div className="cb-root">
        <Navbar />

        {/* ── PAGE HEADER ── */}
        <div className="cb-header">
          {/* decorative bg dots */}
          <div className="cb-dot-dec" style={{width:120,height:120,top:-40,left:-40}}/>
          <div className="cb-dot-dec" style={{width:80,height:80,bottom:20,right:60}}/>
          <div className="cb-dot-dec" style={{width:40,height:40,top:20,right:160}}/>

         
          <div className="cb-header-icon-wrap">
            <BotAvatar />
          </div>
          <h1>Gate Buddy Chatbot</h1>
          <p>Your AI Assistance for Airport Navigation</p>
        </div>

        {/* ── MAIN ── */}
        <div className="cb-main">

          {/* Suggestions */}
          <p className="cb-sugg-label">Quick questions</p>
          <div className="cb-sugg-row">
            {SUGGESTIONS.map(s => (
              <button key={s.q} className="cb-sugg-btn" onClick={() => sendMessage(s.q)}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Chat card */}
          <div className="cb-card">
            {/* Card header */}
            <div className="cb-card-header">
              <div className="cb-card-avatar"><BotAvatar /></div>
              <div>
                <p className="cb-card-title">Gate Buddy</p>
                <p className="cb-card-sub">AI Airport Assistant</p>
              </div>
              <div className="cb-online-dot" title="Online" />
            </div>

            {/* Messages */}
            <div className="cb-msgs">
              {messages.map(msg => (
                <div key={msg.id} className={`cb-row ${msg.role}`}>
                  <div className={`cb-av ${msg.role}`}>
                    {msg.role === "bot"
                      ? <BotAvatar />
                      : <PlaneSmall />
                    }
                  </div>
                  <div className="cb-bubble-wrap">
                    <div className={`cb-bubble ${msg.role}`}>{msg.text}</div>
                    <span className="cb-time">{fmt(msg.time)}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="cb-typing-row">
                  <div className="cb-av bot"><BotAvatar /></div>
                  <div className="cb-typing-bubble"><TypingDots /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="cb-input-area">
              <input
                className="cb-input"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                disabled={isTyping}
              />
              <button
                className="cb-send"
                onClick={() => sendMessage()}
                disabled={isTyping || !input.trim()}
              >
                <SendIcon />
              </button>
            </div>
          </div>

          <p className="cb-note">
            <PlaneSmall /> Gate Buddy is available 24/7 · Nile International Airport
          </p>
        </div>

        <Footer />
      </div>
    </>
  );
}
