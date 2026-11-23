import React, { useState } from "react";
import { getTrackTheme } from "../trackTheme.js";

export default function Dashboard({
  user,
  tracks,
  progressByTrack,
  certificates,
  totalPoints,
  passedCount,
  onOpenTrack,
  onViewCertificate,
  onSaveName,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");

  const saveName = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSaveName(name.trim());
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <main className="dashboard">
      <section className="card profile-card">
        <div className="avatar avatar-lg">{initials || "👤"}</div>
        <div className="profile-info">
          {editing ? (
            <form className="inline-form" onSubmit={saveName}>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <button className="btn btn-primary btn-sm" type="submit">Saqlash</button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setEditing(false); setName(user.name); }}>
                Bekor
              </button>
            </form>
          ) : (
            <h1 className="profile-name">
              Salom, {user.name}!
              <button className="link-btn" onClick={() => setEditing(true)} title="Ismni o'zgartirish">✏️</button>
            </h1>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          <p className="text-muted">{user.email} · Ism sertifikatda shunday chiqadi</p>
        </div>
        <div className="stat-row">
          <div className="stat">
            <span className="stat-value text-blue">{totalPoints}</span>
            <span className="stat-label">ball</span>
          </div>
          <div className="stat">
            <span className="stat-value text-green">{passedCount}</span>
            <span className="stat-label">dars</span>
          </div>
          <div className="stat">
            <span className="stat-value text-red">{certificates.length}</span>
            <span className="stat-label">sertifikat</span>
          </div>
        </div>
      </section>

      <h2 className="section-title">Kurslarim</h2>
      <section className="course-grid">
        {tracks.map((track) => {
          const theme = getTrackTheme(track.slug);
          const p = progressByTrack[track.slug] || {};
          const pct = p.percentage || 0;
          const done = p.completed_tasks || 0;
          const total = p.total_tasks || track.tasks_count || 0;
          return (
            <button key={track.slug} className={`card course-card course-${theme.slug}`} onClick={() => onOpenTrack(track.slug)}>
              <div className="course-card-top">
                <span className={`track-icon-box track-icon-${theme.slug}`}>{theme.icon}</span>
                <span className="chip">{track.level || "Boshlang'ich"}</span>
              </div>
              <h3 className="course-title">{track.title}</h3>
              <p className="course-summary">{track.summary}</p>
              <div className="course-progress">
                <div className="progress-bar-bg">
                  <div className={`progress-bar-fill fill-${theme.slug}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="course-meta">
                  <span>{done}/{total} dars</span>
                  <span>{pct}%</span>
                </div>
              </div>
              <span className="course-cta">{done === 0 ? "Boshlash →" : p.is_completed ? "Ko'rib chiqish →" : "Davom etish →"}</span>
            </button>
          );
        })}
      </section>

      <h2 className="section-title">Sertifikatlarim</h2>
      {certificates.length === 0 ? (
        <div className="card empty-state">
          Hozircha sertifikat yo'q. Kursdagi barcha darslarni topshirsangiz, sertifikat shu yerda paydo bo'ladi.
        </div>
      ) : (
        <section className="cert-list">
          {certificates.map((cert) => (
            <div key={cert.id} className="card cert-row">
              <div>
                <div className="cert-row-title">🎓 {cert.track_title}</div>
                <div className="text-muted">ID: {cert.id} · {new Date(cert.created_at).toLocaleDateString()}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => onViewCertificate(cert)}>Ko'rish</button>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
