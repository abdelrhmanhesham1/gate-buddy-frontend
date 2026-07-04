import { useState, useEffect } from "react";

// Floating button that appears after scrolling down and returns to the top.
export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 900,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid #EDB046",
        background: "#002D6B",
        color: "#EDB046",
        cursor: "pointer",
        boxShadow: "0 6px 20px rgba(0,45,107,0.35)",
        fontSize: "1.4rem",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ↑
    </button>
  );
}
