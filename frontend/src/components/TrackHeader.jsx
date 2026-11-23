import React from "react";
import { getTrackTheme } from "../trackTheme.js";

export default function TrackHeader({ track, tracks, progress, onBack, onSelectTrack }) {
  const theme = getTrackTheme(track?.slug);
  const completed = progress?.completed_tasks || 0;
  const total = progress?.total_tasks || 0;
  const percentage = progress?.percentage || 0;

  return (
    <div className="track-banner">
      <button className="btn btn-ghost btn-sm back-btn" onClick={onBack} title="Kurslar ro'yxatiga qaytish">
        ← <span className="hide-sm">Kurslar</span>
      </button>

      <div className="track-info">
        <span className={`track-icon-box sm track-icon-${theme.slug}`}>{theme.icon}</span>
        <div className="track-text">
          <h1 className="track-title">{track?.title || "Yuklanmoqda..."}</h1>
          <p className="track-summary">{track?.summary}</p>
        </div>
      </div>

      <div className="track-progress">
        <div className="track-progress-meta">
          <span>{completed}/{total} dars</span>
          <strong style={{ color: theme.color }}>{percentage}%</strong>
        </div>
        <div className="progress-bar-bg">
          <div className={`progress-bar-fill fill-${theme.slug}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {tracks?.length > 1 && (
        <select
          className="input track-select"
          value={track?.slug || ""}
          onChange={(e) => onSelectTrack(e.target.value)}
          aria-label="Kursni almashtirish"
        >
          {tracks.map((t) => (
            <option key={t.slug} value={t.slug}>{getTrackTheme(t.slug).icon} {t.title}</option>
          ))}
        </select>
      )}
    </div>
  );
}
