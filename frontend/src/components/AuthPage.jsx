import React, { useState } from "react";
import { api } from "../api.js";

export default function AuthPage({ onAuthenticated, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api(`/api/auth/${mode}`, {
        method: "POST",
        body: mode === "login" ? { email: form.email, password: form.password } : form,
      });
      onAuthenticated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="auth-page">
      <button className="icon-btn auth-theme" onClick={onToggleTheme} title="Rejimni almashtirish">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo-badge">TH</div>
          <div className="brand-title">
            <span className="red">TH</span>
            <span className="blue">Mind</span>
          </div>
        </div>
        <p className="auth-subtitle">
          Frontend, Backend va Kompyuter savodxonligini amalda o'rganing.
        </p>

        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")} type="button">
            Kirish
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")} type="button">
            Ro'yxatdan o'tish
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className="field">
              <span>Ism va familiya</span>
              <input className="input" value={form.name} onChange={update("name")} placeholder="Masalan: Hadicha Halimjonova" autoComplete="name" required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" value={form.email} onChange={update("email")} placeholder="email@example.com" autoComplete="email" required />
          </label>
          <label className="field">
            <span>Parol</span>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder={mode === "register" ? "Kamida 6 ta belgi" : "Parolingiz"}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={mode === "register" ? 6 : undefined}
              required
            />
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? "Kuting..." : mode === "login" ? "Kirish" : "Hisob yaratish"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Hisobingiz yo'qmi? " : "Hisobingiz bormi? "}
          <button type="button" className="link-btn" onClick={() => switchMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Ro'yxatdan o'ting" : "Kirish"}
          </button>
        </p>
      </div>
    </div>
  );
}
