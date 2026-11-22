import React, { useState } from "react";

export default function UserProfileModal({
  userName,
  userPoints,
  passedTaskIds,
  certificates,
  onSaveName,
  onViewCertificate,
  onResetProgress,
  onClose,
}) {
  const [name, setName] = useState(userName || "");
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveName(name.trim());
    setSavedMsg("Ism muvaffaqiyatli saqlandi!");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>👤</span>
            <h3 style={{ fontSize: "16px", fontWeight: "800" }}>O'quvchi Profili</h3>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Name Editor */}
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-secondary)" }}>
              To'liq Ism va Familiyangiz (Sertifikatda chop etiladi):
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--bg-card-secondary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button type="submit" className="btn btn-primary">
                Saqlash
              </button>
            </div>
            {savedMsg && (
              <span style={{ fontSize: "12px", color: "var(--badge-green)", fontWeight: "600" }}>
                ✅ {savedMsg}
              </span>
            )}
          </form>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "var(--bg-card-secondary)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Yig'ilgan Ballar:</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--blue-500)" }}>{userPoints} ball</div>
            </div>
            <div style={{ background: "var(--bg-card-secondary)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Bajarilgan Topshiriqlar:</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--badge-green)" }}>{passedTaskIds.length} ta</div>
            </div>
          </div>

          {/* Certificates Earned */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "800", marginBottom: "10px" }}>
              Mening Sertifikatlarim ({certificates?.length || 0}):
            </h4>
            {(!certificates || certificates.length === 0) ? (
              <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px", background: "var(--bg-card-secondary)", borderRadius: "8px" }}>
                Hozircha sertifikat yo'q. Kursdagi barcha topshiriqlarni yakunlab, sertifikatga ega bo'ling!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      background: "var(--bg-card-secondary)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>
                        🎓 {cert.track_title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        ID: {cert.id} • {new Date(cert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => onViewCertificate(cert)}
                      style={{ fontSize: "12px", padding: "6px 12px" }}
                    >
                      Ko'rish & Chop etish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <button
              className="btn btn-ghost"
              onClick={onResetProgress}
              style={{ color: "var(--red-500)", fontSize: "12px" }}
            >
              ⚠️ Progressimni tozalash va kursni qaytadan boshlash
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Yopish</button>
        </div>
      </div>
    </div>
  );
}
