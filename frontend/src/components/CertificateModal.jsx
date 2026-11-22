import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function CertificateModal({
  certificate,
  trackSlug,
  trackTitle,
  userName,
  onClose,
  onClaim,
}) {
  const [nameInput, setNameInput] = useState(userName || "");
  const [isClaiming, setIsClaiming] = useState(false);
  const [currentCert, setCurrentCert] = useState(certificate);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"],
    });
  }, []);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      alert("Iltimos, sertifikatda chiqishi uchun to'liq ism-familiyangizni kiriting!");
      return;
    }
    setIsClaiming(true);
    try {
      const res = await onClaim(nameInput.trim(), trackSlug);
      if (res?.certificate) {
        setCurrentCert(res.certificate);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
        });
      }
    } catch (err) {
      alert("Sertifikat olishda xatolik: " + err.message);
    } finally {
      setIsClaiming(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    if (currentCert?.id) {
      navigator.clipboard.writeText(currentCert.id);
      alert(`Sertifikat ID (${currentCert.id}) nusxalandi!`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: "860px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header no-print">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🎓</span>
            <h3 style={{ fontSize: "16px", fontWeight: "800" }}>
              {currentCert ? "Rasmiy Bitiruv Sertifikati" : "Sertifikatni Rasmiylashtirish"}
            </h3>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: "18px" }}>
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {!currentCert ? (
            <div style={{ width: "100%", maxWidth: "480px", textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "8px" }}>
                Tabriklaymiz! Kursni to'liq tugatdingiz!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
                Siz <strong>{trackTitle}</strong> yo'nalishidagi barcha topshiriqlarni 100% to'g'ri bajardingiz.
                Sertifikatga yozilishi uchun ism-familiyangizni tasdiqlang:
              </p>

              <form onSubmit={handleClaim} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Masalan: Sardor Rahimov"
                  required
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "var(--bg-card-secondary)",
                    border: "2px solid var(--blue-500)",
                    color: "var(--text-primary)",
                    fontSize: "15px",
                    fontWeight: "600",
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary glow-red-blue"
                  disabled={isClaiming}
                  style={{ padding: "12px 24px", fontSize: "15px" }}
                >
                  {isClaiming ? "Tayyorlanmoqda..." : "🎓 Sertifikatni Yaratish va Olish"}
                </button>
              </form>
            </div>
          ) : (
            <div className="certificate-container">
              <div className="certificate-inner-border">
                {/* Header with academy brand */}
                <div className="cert-header">
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #ef4444, #2563eb)",
                      color: "white",
                      fontWeight: "900",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    TH
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "1px", color: "#0f172a" }}>
                      TH MIND ACADEMY
                    </div>
                    <div className="cert-badge">XALQARO DASTURLASH STANDARTLARI</div>
                  </div>
                </div>

                <div className="cert-title">SERTIFIKAT</div>

                <div className="cert-recipient-label">
                  Ushbu hujjat quyidagi o'quvchiga berildi:
                </div>

                <div className="cert-name">{currentCert.user_name}</div>

                <div className="cert-desc">
                  Ushbu sertifikat egasi <strong>TH Mind Dasturlash Akademiyasi</strong>ning{" "}
                  <strong>"{currentCert.track_title}"</strong> kursi bo'yicha barcha nazariy va
                  amaliy topshiriqlarni hamda sun'iy intellekt nazoratidagi dasturlash loyihalarini
                  muvaffaqiyatli topshirganligini tasdiqlaydi.
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "24px",
                    fontSize: "13px",
                    color: "#475569",
                    fontWeight: "600",
                    margin: "16px 0",
                  }}
                >
                  <div>
                    O'zlashtirish darajasi: <strong style={{ color: "#059669" }}>{currentCert.grade || "A'lo (100%)"}</strong>
                  </div>
                  <div>•</div>
                  <div>
                    Jami ball: <strong style={{ color: "#2563eb" }}>{currentCert.score} / {currentCert.total_score}</strong>
                  </div>
                </div>

                <div className="cert-footer">
                  <div style={{ textAlign: "left", fontSize: "11px", color: "#64748b" }}>
                    <div>Berilgan sana: <strong>{new Date(currentCert.created_at).toLocaleDateString()}</strong></div>
                    <div>Sertifikat ID: <strong style={{ color: "#b91c1c" }}>{currentCert.id}</strong></div>
                    <div style={{ marginTop: "4px", color: "#0284c7" }}>
                      Tekshirish manzili: thmind.uz/verify
                    </div>
                  </div>

                  <div className="cert-seal">
                    <span style={{ fontSize: "18px" }}>⭐</span>
                    <span>TH MIND</span>
                    <span style={{ fontSize: "8px" }}>TASDIQLANGAN</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "cursive", fontSize: "18px", color: "#1e293b", marginBottom: "2px" }}>
                      H. Tursunov
                    </div>
                    <div style={{ height: "1px", background: "#94a3b8", width: "140px", margin: "2px 0 4px auto" }} />
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569" }}>
                      Katta Ta'lim Rahbari
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {currentCert && (
          <div className="modal-footer no-print">
            <button className="btn btn-secondary" onClick={handleCopyId}>
              📋 ID Nusxalash
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ Chop etish / PDF Saqlash
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              Yopish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
