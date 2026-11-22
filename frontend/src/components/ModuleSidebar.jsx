import React from "react";
import { getTrackTheme } from "../trackTheme.js";

export default function ModuleSidebar({
  trackSlug,
  modules,
  currentTaskId,
  passedTaskIds,
  onSelectTask,
  onRetry,
}) {
  const theme = getTrackTheme(trackSlug);
  const allTasksCount = modules?.reduce((sum, m) => sum + (m.tasks?.length || 0), 0) || 0;

  return (
    <aside className="modules-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{theme.icon}</span>
          <span>{theme.label}</span>
        </span>
        <span
          style={{
            fontSize: "11px",
            background: theme.light,
            color: theme.color,
            padding: "2px 8px",
            borderRadius: "10px",
            fontWeight: "700",
          }}
        >
          {allTasksCount} topshiriq
        </span>
      </div>

      {/* Modules List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {(!modules || modules.length === 0) ? (
          <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <p style={{ fontSize: "13px", marginBottom: "12px" }}>
              Darslar yuklanmoqda yoki serverga ulanish kutilmoqda...
            </p>
            {onRetry && (
              <button className="btn btn-secondary" onClick={onRetry} style={{ fontSize: "12px" }}>
                🔄 Qayta yuklash
              </button>
            )}
          </div>
        ) : (
          modules.map((mod, modIdx) => (
            <div key={mod.id || modIdx} className="module-group">
              {/* Module Title Bar */}
              <div
                className="module-title-bar"
                onClick={() => {
                  if (mod.tasks && mod.tasks.length > 0) {
                    onSelectTask(mod.tasks[0]);
                  }
                }}
                style={{ cursor: "pointer" }}
                title="Modulning birinchi topshirig'ini ochish"
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📂</span>
                  <span style={{ fontWeight: "700" }}>{modIdx + 1}. {mod.title}</span>
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
                  {mod.tasks?.filter((t) => passedTaskIds.includes(t.id)).length}/{mod.tasks?.length || 0}
                </span>
              </div>

              {/* Tasks List */}
              <div className="module-tasks-list">
                {mod.tasks?.map((task, taskIdx) => {
                  const isPassed = passedTaskIds.includes(task.id);
                  const isActive = task.id === currentTaskId;

                  return (
                    <div
                      key={task.id}
                      className={`task-item ${isActive ? `active track-${trackSlug}` : ""}`}
                      onClick={() => onSelectTask(task)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectTask(task);
                        }
                      }}
                      title={`${task.title} topshirig'ini ochish`}
                      style={{
                        cursor: "pointer",
                        userSelect: "none",
                        backgroundColor: isActive ? theme.light : undefined,
                      }}
                    >
                      <div className="task-item-left">
                        <span className="task-status-icon" style={{ fontSize: "14px" }}>
                          {isPassed ? "✅" : isActive ? "🎯" : "⭕"}
                        </span>
                        <span
                          style={{
                            fontWeight: isActive ? "800" : isPassed ? "500" : "600",
                            color: isActive
                              ? theme.color
                              : isPassed
                              ? "var(--text-secondary)"
                              : "var(--text-primary)",
                          }}
                        >
                          {modIdx + 1}.{taskIdx + 1} {task.title}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background:
                              task.language === "html"
                                ? "rgba(239, 68, 68, 0.15)"
                                : task.language === "quiz"
                                ? "var(--green-light)"
                                : task.language === "css"
                                ? "rgba(59, 130, 246, 0.15)"
                                : "rgba(245, 158, 11, 0.15)",
                            color:
                              task.language === "html"
                                ? "var(--red-500)"
                                : task.language === "quiz"
                                ? "var(--green-500)"
                                : task.language === "css"
                                ? "var(--blue-500)"
                                : "#eab308",
                          }}
                        >
                          {task.language === "quiz" ? "test" : task.language}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>
                          +{task.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
