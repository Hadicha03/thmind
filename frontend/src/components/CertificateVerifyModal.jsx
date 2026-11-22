import React, { useState } from "react";

export default function CertificateVerifyModal({ onClose }) {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(certId.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Sertifikat topilmadi");
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🔍</span>
            <h3 style={{ fontSize: "16px", fontWeight: "800" }}>Sertifikatni Haqiqiyligini Tekshirish</h3>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            TH Mind tomonidan taqdim etilgan istalgan sertifikatning ID raqamini kiriting va uning haqiqiyligini tekshiring.
          </p>

          <form onSubmit={handleVerify} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Masalan: THM-FRONTEND-123456"
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--bg-card-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !certId.trim()}>
              {loading ? "Tekshirilmoqda..." : "Tekshirish"}
            </button>
          </form>

          {error && (
            <div style={{ background: "var(--badge-red-bg)", color: "var(--badge-red)", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div
              style={{
                background: "var(--badge-green-bg)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "13.5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--badge-green)", fontWeight: "800", fontSize: "15px", marginBottom: "12px" }}>
                <span>✅</span>
                <span>SERTIFIKAT HAQIQIY VA TASDIQLANGAN!</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "var(--text-primary)" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block" }}>TALABA:</span>
                  <strong>{result.user_name}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block" }}>KURS YO'NALISHI:</span>
                  <strong>{result.track_title}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block" }}>BALL VA BAHOSI:</span>
                  <strong>{result.score} ball ({result.grade})</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block" }}>BERILGAN SANA:</span>
                  <strong>{new Date(result.created_at).toLocaleDateString()}</strong>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", display: "block" }}>BERUVCHI TASHKILOT:</span>
                  <span>{result.issuer} — {result.instructor}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Yopish</button>
        </div>
      </div>
    </div>
  );
}
