import React from "react";

export default function Header({
  currentTrack,
  onSelectTrack,
  theme,
  onToggleTheme,
  userName,
  userPoints,
  earnedCertificatesCount,
  onOpenCertificates,
  onOpenVerify,
  onOpenProfile,
  onOpenAdmin,
}) {
  return (
    <header className="app-header">
      {/* Brand Logo */}
      <div className="brand" onClick={() => onSelectTrack("frontend")}>
        <div className="brand-logo-badge">TH</div>
        <div className="brand-text">
          <div className="brand-title">
            <span className="red">TH</span>
            <span className="blue">Mind</span>
          </div>
          <div className="brand-subtitle">Dasturlash Akademiyasi</div>
        </div>
      </div>

      {/* Track Switcher (Frontend / Backend) */}
      <div className="track-switcher">
        <button
          className={`track-btn ${currentTrack === "frontend" ? "active-frontend" : ""}`}
          onClick={() => onSelectTrack("frontend")}
          title="Frontend dasturlash darslari va topshiriqlari"
        >
          <span>🎨</span>
          <span>Frontend</span>
        </button>
        <button
          className={`track-btn ${currentTrack === "backend" ? "active-backend" : ""}`}
          onClick={() => onSelectTrack("backend")}
          title="Backend dasturlash darslari va topshiriqlari"
        >
          <span>⚙️</span>
          <span>Backend</span>
        </button>
        <button
          className={`track-btn ${currentTrack === "savodxonlik" ? "active-savodxonlik" : ""}`}
          onClick={() => onSelectTrack("savodxonlik")}
          title="Kompyuter savodxonligi darslari va testlari"
        >
          <span>💻</span>
          <span className="label-full">Kompyuter savodxonligi</span>
          <span className="label-short">Savodxonlik</span>
        </button>
      </div>

      {/* Actions */}
      <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Certificate shortcut */}
        <button
          className="btn btn-secondary"
          onClick={onOpenCertificates}
          title="Mening sertifikatlarim"
          style={{ fontSize: "13px", padding: "6px 12px" }}
        >
          <span>🎓</span>
          <span className="btn-label">Sertifikatlar</span>
          {earnedCertificatesCount > 0 && (
            <span
              style={{
                background: "var(--red-600)",
                color: "white",
                borderRadius: "10px",
                padding: "1px 6px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {earnedCertificatesCount}
            </span>
          )}
        </button>

        {/* Certificate Verify */}
        <button
          className="btn btn-ghost"
          onClick={onOpenVerify}
          title="Sertifikat haqiqiyligini tekshirish"
          style={{ fontSize: "13px", padding: "6px 10px" }}
        >
          <span>🔍</span>
          <span className="btn-label">Tekshiruv</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          className="btn btn-ghost"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Kunduzgi (Light) rejimga o'tish" : "Tungi (Dark) rejimga o'tish"}
          style={{ padding: "6px 10px", fontSize: "16px" }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Student Profile */}
        <button
          className="btn btn-secondary"
          onClick={onOpenProfile}
          title="Talaba profili"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px" }}
        >
          <span>👤</span>
          <span className="btn-label" style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis" }}>
            {userName || "O'quvchi"}
          </span>
          <span
            style={{
              background: "var(--badge-blue-bg)",
              color: "var(--blue-500)",
              borderRadius: "6px",
              padding: "2px 6px",
              fontSize: "11px",
              fontWeight: "700",
            }}
          >
            {userPoints} ball
          </span>
        </button>

        {/* Admin Panel button */}
        <button
          className="btn btn-primary"
          onClick={onOpenAdmin}
          title="Admin paneli (kurslarni va topshiriqlarni boshqarish)"
          style={{ fontSize: "13px", padding: "6px 14px" }}
        >
          <span>🛡️</span>
          <span className="btn-label">Admin</span>
        </button>
      </div>
    </header>
  );
}
