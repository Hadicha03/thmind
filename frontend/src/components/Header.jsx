import React, { useEffect, useRef, useState } from "react";

export default function Header({
  user,
  userPoints,
  theme,
  onToggleTheme,
  onGoHome,
  onOpenVerify,
  onOpenAdmin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const initials = (user?.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const run = (fn) => () => {
    setMenuOpen(false);
    fn();
  };

  return (
    <header className="app-header">
      <button className="brand" onClick={onGoHome} title="Bosh sahifa">
        <span className="brand-logo-badge">TH</span>
        <span className="brand-title">
          <span className="red">TH</span>
          <span className="blue">Mind</span>
        </span>
      </button>

      <div className="header-actions">
        <span className="points-chip" title="Yig'ilgan ballar">⭐ {userPoints}</span>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="menu-wrap" ref={menuRef}>
          <button className="avatar-btn" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={menuOpen}>
            <span className="avatar">{initials || "👤"}</span>
            <span className="avatar-name">{user?.name}</span>
            <span className="caret">▾</span>
          </button>
          {menuOpen && (
            <div className="dropdown" role="menu">
              <div className="dropdown-head">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <button role="menuitem" onClick={run(onGoHome)}>🏠 Profil va kurslar</button>
              <button role="menuitem" onClick={run(onOpenVerify)}>🔍 Sertifikatni tekshirish</button>
              <button role="menuitem" onClick={run(onOpenAdmin)}>🛡️ Admin panel</button>
              <div className="dropdown-sep" />
              <button role="menuitem" className="danger" onClick={run(onLogout)}>🚪 Chiqish</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
