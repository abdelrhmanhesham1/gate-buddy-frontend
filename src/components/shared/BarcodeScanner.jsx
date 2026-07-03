import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const READER_ID = "gb-bcbp-reader";

// Boarding-pass barcodes are usually PDF417 or Aztec; also accept QR / DataMatrix / Code128.
const FORMATS = [
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.CODE_128,
];

/**
 * Full-screen modal that opens the device camera and decodes a boarding-pass
 * barcode. Calls onScan(decodedText) on success (camera or manual entry).
 */
export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const doneRef = useRef(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState("");

  const stop = async () => {
    const sc = scannerRef.current;
    if (!sc) return;
    try {
      if (sc.getState && sc.getState() === 2 /* SCANNING */) await sc.stop();
      await sc.clear();
    } catch { /* already stopped */ }
    scannerRef.current = null;
  };

  useEffect(() => {
    const scanner = new Html5Qrcode(READER_ID, { formatsToSupport: FORMATS, verbose: false });
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 320, height: 180 } },
        (decodedText) => {
          if (doneRef.current) return;
          doneRef.current = true;
          stop().then(() => onScan(decodedText));
        },
        () => { /* per-frame decode miss — ignore */ }
      )
      .catch(() => {
        if (!cancelled) setError("Couldn't access the camera. Paste the barcode below instead.");
      });

    return () => { cancelled = true; stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitManual = () => {
    const v = manual.trim();
    if (!v) return;
    doneRef.current = true;
    stop().then(() => onScan(v));
  };

  const cancel = () => stop().then(onClose);

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.header}>
          <span style={S.title}>Scan Boarding Pass</span>
          <button style={S.close} onClick={cancel} aria-label="Close">✕</button>
        </div>

        <div id={READER_ID} style={S.reader} />

        {error ? (
          <p style={S.error}>{error}</p>
        ) : (
          <p style={S.hint}>Point your camera at the boarding-pass barcode (QR / PDF417 / Aztec).</p>
        )}

        <div style={S.manualRow}>
          <input
            style={S.input}
            placeholder="…or paste the barcode data"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitManual()}
          />
          <button style={S.submit} onClick={submitManual}>Track</button>
        </div>

        <button style={S.cancel} onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

const PRIMARY = "#002D6B";
const SECONDARY = "#EDB046";
const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,20,50,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", border: `1.5px solid ${SECONDARY}` },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: PRIMARY, fontWeight: 800, fontSize: "1.05rem" },
  close: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: PRIMARY },
  reader: { width: "100%", minHeight: 240, borderRadius: 12, overflow: "hidden", background: "#0b1f3a" },
  hint: { fontSize: "0.82rem", color: "#6B7280", textAlign: "center", margin: "12px 0 8px" },
  error: { fontSize: "0.82rem", color: "#dc2626", textAlign: "center", margin: "12px 0 8px" },
  manualRow: { display: "flex", gap: 8, marginTop: 8 },
  input: { flex: 1, border: `1.5px solid ${SECONDARY}`, borderRadius: 8, padding: "10px 12px", fontSize: "0.85rem", outline: "none" },
  submit: { background: PRIMARY, color: SECONDARY, border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer" },
  cancel: { width: "100%", marginTop: 12, background: "#fff", color: PRIMARY, border: `1.5px solid ${SECONDARY}`, borderRadius: 8, padding: "10px", fontWeight: 700, cursor: "pointer" },
};
