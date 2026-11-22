import React from "react";

export default function TrackHeader({
  track,
  progress,
  onClaimCertificate,
  hasCertificate,
}) {
  const isFrontend = track?.slug === "frontend";
  const completed = progress?.completed_tasks || 0;
  const total = progress?.total_tasks || 0;
  const percentage = progress?.percentage || 0;
  const earnedPoints = progress?.earned_points || 0;
  const totalPoints = progress?.total_points || 0;
  const isComplete = total > 0 && completed === total;

  return (
    <div className="track-banner">
      <div className="track-info">
        <div className={`track-icon-box ${isFrontend ? "track-icon-frontend" : "track-icon-backend"}`}>
          {isFrontend ? "🎨" : "⚙️"}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: "800" }}>{track?.title || "Yuklanmoqda..."}</h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "12px",
                background: isFrontend ? "var(--red-light)" : "var(--blue-light)",
                color: isFrontend ? "var(--red-500)" : "var(--blue-500)",
                border: `1px solid ${isFrontend ? "var(--red-500)" : "var(--blue-500)"}`,
              }}
            >
              {track?.level || "Boshlang'ich"}
            </span>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {track?.summary || "Dasturlash asoslarini amaliy topshiriqlar bilan o'rganing"}
          </p>
        </div>
      </div>

      {/* Progress & Certificate status */}
      <div className="track-progress-container">
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
              Progress: <strong style={{ color: "var(--text-primary)" }}>{completed}/{total}</strong> topshiriq ({percentage}%)
            </span>
            <span style={{ color: isFrontend ? "var(--red-500)" : "var(--blue-500)", fontWeight: "700" }}>
              {earnedPoints}/{totalPoints} ball
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill ${isFrontend ? "fill-frontend" : "fill-backend"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Certificate Button */}
        <div>
          {isComplete ? (
            <button
              className="btn btn-primary glow-red-blue"
              onClick={onClaimCertificate}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              <span>🎓</span>
              <span>{hasCertificate ? "Sertifikatni Ko'rish" : "Sertifikatni Olish!"}</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={onClaimCertificate}
              style={{ padding: "8px 14px", fontSize: "12px", opacity: 0.8 }}
              title="Barcha topshiriqlarni bajaring va rasmiy sertifikatga ega bo'ling"
            >
              <span>🔒</span>
              <span>Sertifikat ({total - completed} ta qoldi)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
