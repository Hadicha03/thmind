import React, { useEffect, useMemo, useState } from "react";
import { getTrackTheme } from "../trackTheme.js";

const LANG_LABEL = { quiz: "test", javascript: "js" };

export default function ModuleSidebar({
  trackSlug,
  modules,
  currentTaskId,
  passedTaskIds,
  progress,
  hasCertificate,
  onSelectTask,
  onOpenCertificate,
  onRetry,
}) {
  const theme = getTrackTheme(trackSlug);
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeModuleId = useMemo(
    () => modules?.find((m) => m.tasks?.some((t) => t.id === currentTaskId))?.id,
    [modules, currentTaskId]
  );

  useEffect(() => {
    if (activeModuleId) setOpenIds((prev) => new Set(prev).add(activeModuleId));
  }, [activeModuleId]);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const q = query.trim().toLowerCase();
  const total = progress?.total_tasks || 0;
  const completed = progress?.completed_tasks || 0;
  const isComplete = total > 0 && completed === total;
  const currentTitle = modules?.flatMap((m) => m.tasks || []).find((t) => t.id === currentTaskId)?.title;

  return (
    <aside className={`modules-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen}>
        <span>📚 Darslar ro'yxati</span>
        <span className="sidebar-current">{currentTitle}</span>
        <span className="caret">{mobileOpen ? "▴" : "▾"}</span>
      </button>

      <div className="sidebar-body">
        <div className="sidebar-search">
          <input
            className="input input-sm"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Dars qidirish..."
          />
        </div>

        <div className="sidebar-list">
          {!modules || modules.length === 0 ? (
            <div className="empty-state">
              <p>Darslar yuklanmoqda...</p>
              {onRetry && (
                <button className="btn btn-secondary btn-sm" onClick={onRetry}>🔄 Qayta yuklash</button>
              )}
            </div>
          ) : (
            modules.map((mod, modIdx) => {
              const tasks = (mod.tasks || [])
                .map((task, taskIdx) => ({ task, num: `${modIdx + 1}.${taskIdx + 1}` }))
                .filter(({ task }) => !q || task.title.toLowerCase().includes(q));
              if (q && tasks.length === 0) return null;
              const isOpen = q ? true : openIds.has(mod.id);
              const doneCount = (mod.tasks || []).filter((t) => passedTaskIds.includes(t.id)).length;
              const allDone = mod.tasks?.length > 0 && doneCount === mod.tasks.length;

              return (
                <div key={mod.id || modIdx} className={`module-group ${isOpen ? "open" : ""}`}>
                  <button className="module-title-bar" onClick={() => toggle(mod.id)} aria-expanded={isOpen}>
                    <span className="caret">{isOpen ? "▾" : "▸"}</span>
                    <span className="module-name">{modIdx + 1}. {mod.title}</span>
                    <span className={`module-count ${allDone ? "done" : ""}`}>{doneCount}/{mod.tasks?.length || 0}</span>
                  </button>

                  {isOpen && (
                    <div className="module-tasks-list">
                      {tasks.map(({ task, num }) => {
                        const isPassed = passedTaskIds.includes(task.id);
                        const isActive = task.id === currentTaskId;
                        const state = isActive ? "active" : isPassed ? "done" : "todo";
                        return (
                          <button
                            key={task.id}
                            className={`task-item ${state} track-${theme.slug}`}
                            onClick={() => {
                              onSelectTask(task);
                              setMobileOpen(false);
                            }}
                            title={task.title}
                          >
                            <span className={`status-dot ${state}`}>{isPassed ? "✓" : ""}</span>
                            <span className="task-name">
                              <span className="task-num">{num}</span> {task.title}
                            </span>
                            <span className={`lang-tag lang-${task.language}`}>
                              {LANG_LABEL[task.language] || task.language}
                            </span>
                            <span className="task-points">+{task.points}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="sidebar-footer">
          <button
            className={`btn btn-block btn-sm ${isComplete ? "btn-primary" : "btn-secondary"}`}
            onClick={onOpenCertificate}
            title="Barcha darslarni topshirib, sertifikat oling"
          >
            🎓 {isComplete ? (hasCertificate ? "Sertifikatni ko'rish" : "Sertifikatni olish") : `Sertifikat · ${total - completed} ta dars qoldi`}
          </button>
        </div>
      </div>
    </aside>
  );
}
