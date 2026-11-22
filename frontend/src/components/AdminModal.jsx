import React, { useState, useEffect } from "react";

export default function AdminModal({ onClose, onRefreshTracks }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("thmind_admin_token") || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("stats"); // 'stats', 'tasks', 'submissions', 'certificates', 'settings'

  // Data
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  // Task form state (create or edit)
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    track_slug: "frontend",
    module_id: "mod-custom",
    language: "javascript",
    points: 10,
    starter_code: "",
    solution_code: "",
    instructions: "",
    checker_json: "",
  });

  // Settings form
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-1.5-flash");
  const [useRealAi, setUseRealAi] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  // Inspect submission
  const [selectedSub, setSelectedSub] = useState(null);

  // Authenticate
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parol noto'g'ri");
      setToken(data.token);
      sessionStorage.setItem("thmind_admin_token", data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    sessionStorage.removeItem("thmind_admin_token");
  };

  // Fetch admin data
  const authHeaders = {
    "Content-Type": "application/json",
    "x-admin-password": token,
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", { headers: authHeaders });
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/admin/tasks", { headers: authHeaders });
      if (res.ok) setTasks(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions", { headers: authHeaders });
      if (res.ok) setSubmissions(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadCertificates = async () => {
    try {
      const res = await fetch("/api/admin/certificates", { headers: authHeaders });
      if (res.ok) setCertificates(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setGeminiKey(data.gemini_api_key || "");
        setGeminiModel(data.gemini_model || "gemini-1.5-flash");
        setUseRealAi(Boolean(data.use_real_ai));
        setSystemPrompt(data.system_prompt || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === "stats") loadStats();
      if (activeTab === "tasks") loadTasks();
      if (activeTab === "submissions") loadSubmissions();
      if (activeTab === "certificates") loadCertificates();
      if (activeTab === "settings") loadSettings();
    }
  }, [token, activeTab]);

  // Handle Task Save
  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      let checkerObj = {};
      try {
        checkerObj = JSON.parse(taskForm.checker_json || "{}");
      } catch {
        alert("Checker maydoni to'g'ri JSON formatida bo'lishi kerak!");
        return;
      }

      const body = {
        title: taskForm.title,
        track_slug: taskForm.track_slug,
        module_id: taskForm.module_id,
        language: taskForm.language,
        points: Number(taskForm.points) || 10,
        starter_code: taskForm.starter_code,
        solution_code: taskForm.solution_code,
        instructions: taskForm.instructions,
        checker: checkerObj,
      };

      const url = editingTask ? `/api/admin/tasks/${editingTask.id}` : "/api/admin/tasks";
      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(body),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Saqlashda xatolik");

      alert(editingTask ? "Topshiriq yangilandi!" : "Yangi topshiriq qo'shildi!");
      setEditingTask(null);
      loadTasks();
      if (onRefreshTracks) onRefreshTracks();
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Haqiqatan ham bu topshiriqni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      loadTasks();
      if (onRefreshTracks) onRefreshTracks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      track_slug: task.track_slug,
      module_id: task.module_id,
      language: task.language,
      points: task.points,
      starter_code: task.starter_code || "",
      solution_code: task.solution_code || "",
      instructions: task.instructions || "",
      checker_json: JSON.stringify(task.checker || {}, null, 2),
    });
  };

  const handleNewTaskClick = () => {
    setEditingTask({ id: "" });
    setTaskForm({
      title: "",
      track_slug: "frontend",
      module_id: "mod-custom",
      language: "javascript",
      points: 10,
      starter_code: "function yangiFunksiya() {\n  \n}\n",
      solution_code: "function yangiFunksiya() {\n  return true;\n}\n",
      instructions: "Vazifa shartlarini batafsil yozing...",
      checker_json: JSON.stringify(
        {
          tests: [
            { name: "Sinov 1", fn: "yangiFunksiya", args: [], expect: true, hint: "true qaytaring" },
          ],
        },
        null,
        2
      ),
    });
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const body = {
        gemini_api_key: geminiKey,
        gemini_model: geminiModel,
        use_real_ai: useRealAi,
        system_prompt: systemPrompt,
      };
      if (newAdminPass.trim()) {
        body.new_admin_password = newAdminPass.trim();
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sozlamalarni saqlashda xatolik");

      setSettingsSavedMsg("Sozlamalar muvaffaqiyatli saqlandi!");
      if (newAdminPass.trim()) {
        setToken(newAdminPass.trim());
        sessionStorage.setItem("thmind_admin_token", newAdminPass.trim());
        setNewAdminPass("");
      }
      setTimeout(() => setSettingsSavedMsg(""), 3000);
      loadSettings();
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  // Reset database
  const handleResetDb = async () => {
    if (
      window.confirm(
        "DIQQAT: Ma'lumotlar bazasini zavod parametrlariga qaytarsangiz, qo'shilgan topshiriqlar, talabalar javoblari va sertifikatlar o'chiriladi. Rozimisiz?"
      )
    ) {
      try {
        const res = await fetch("/api/admin/reset", {
          method: "POST",
          headers: authHeaders,
        });
        if (!res.ok) throw new Error("Reset xatoligi");
        alert("Baza muvaffaqiyatli tiklandi!");
        loadStats();
        loadTasks();
        if (onRefreshTracks) onRefreshTracks();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: "1000px", height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>🛡️</span>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "800" }}>TH Mind Boshqaruv (Admin) Paneli</h3>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Kurslar, topshiriqlar, AI ustozi va talabalar monitoringi
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {token && (
              <button className="btn btn-ghost" onClick={handleLogout} style={{ fontSize: "12px", color: "var(--red-500)" }}>
                Chiqish
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* If not logged in */}
        {!token ? (
          <div className="modal-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "380px", textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "8px" }}>Admin Tizimiga Kirish</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Admin panelini boshqarish uchun maxfiy parolni kiriting (standart parol: <code>admin</code>)
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Admin paroli..."
                  autoFocus
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-card-secondary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                    textAlign: "center",
                  }}
                />
                {loginError && (
                  <span style={{ color: "var(--badge-red)", fontSize: "12px", fontWeight: "600" }}>
                    ❌ {loginError}
                  </span>
                )}
                <button type="submit" className="btn btn-primary">
                  Kirish
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Admin Tabs */}
            <div className="results-tabs" style={{ padding: "0 16px", background: "var(--bg-surface)" }}>
              <button
                className={`results-tab-btn ${activeTab === "stats" ? "active" : ""}`}
                onClick={() => { setActiveTab("stats"); setEditingTask(null); }}
              >
                <span>📊</span>
                <span>Statistika</span>
              </button>
              <button
                className={`results-tab-btn ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => setActiveTab("tasks")}
              >
                <span>📝</span>
                <span>Topshiriqlar ({tasks.length || stats?.total_tasks || 0})</span>
              </button>
              <button
                className={`results-tab-btn ${activeTab === "submissions" ? "active" : ""}`}
                onClick={() => { setActiveTab("submissions"); setEditingTask(null); }}
              >
                <span>📥</span>
                <span>Yuborilgan Kodlar</span>
              </button>
              <button
                className={`results-tab-btn ${activeTab === "certificates" ? "active" : ""}`}
                onClick={() => { setActiveTab("certificates"); setEditingTask(null); }}
              >
                <span>🎓</span>
                <span>Sertifikatlar</span>
              </button>
              <button
                className={`results-tab-btn ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => { setActiveTab("settings"); setEditingTask(null); }}
              >
                <span>⚙️</span>
                <span>AI & Sozlamalar</span>
              </button>
            </div>

            {/* Content area */}
            <div className="modal-body" style={{ flex: 1, overflowY: "auto" }}>
              {/* TAB 1: STATS */}
              {activeTab === "stats" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                    <div style={{ background: "var(--bg-card-secondary)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Jami Topshiriqlar:</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--blue-500)" }}>{stats?.total_tasks || 0} ta</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Frontend: {stats?.frontend_tasks || 0} • Backend: {stats?.backend_tasks || 0}
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-card-secondary)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Jami Tekshiruvlar:</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)" }}>{stats?.total_submissions || 0}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Muvaffaqiyat: {stats?.success_rate || 0}%
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-card-secondary)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Berilgan Sertifikatlar:</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--badge-green)" }}>{stats?.total_certificates || 0} ta</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        100% bitiruvchilar
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-card-secondary)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>O'quvchilar Soni:</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--red-500)" }}>{stats?.unique_students || 1} kishi</div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-card-secondary)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "12px" }}>🚀 Tezkor Harakatlar:</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button className="btn btn-primary" onClick={() => { setActiveTab("tasks"); handleNewTaskClick(); }}>
                        ➕ Yangi topshiriq yaratish
                      </button>
                      <button className="btn btn-blue" onClick={() => setActiveTab("settings")}>
                        ⚙️ Gemini AI kalitini sozlash
                      </button>
                      <button className="btn btn-secondary" onClick={loadStats}>
                        🔄 Statistikani yangilash
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TASKS */}
              {activeTab === "tasks" && (
                <div>
                  {!editingTask ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: "800" }}>Mavjud topshiriqlar ro'yxati</h4>
                        <button className="btn btn-primary" onClick={handleNewTaskClick}>
                          ➕ Yangi topshiriq qo'shish
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {tasks.map((t) => (
                          <div
                            key={t.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 16px",
                              background: "var(--bg-card-secondary)",
                              borderRadius: "8px",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: t.track_slug === "frontend" ? "var(--red-light)" : "var(--blue-light)",
                                  color: t.track_slug === "frontend" ? "var(--red-500)" : "var(--blue-500)",
                                }}
                              >
                                {t.track_slug.toUpperCase()}
                              </span>
                              <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{t.title}</span>
                              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                ({t.language} • {t.points} ball)
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleEditClick(t)}
                                style={{ fontSize: "12px", padding: "4px 10px" }}
                              >
                                Tahrirlash
                              </button>
                              <button
                                className="btn btn-ghost"
                                onClick={() => handleDeleteTask(t.id)}
                                style={{ fontSize: "12px", padding: "4px 8px", color: "var(--red-500)" }}
                              >
                                O'chirish
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* EDIT / CREATE FORM */
                    <form onSubmit={handleSaveTask} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ fontSize: "16px", fontWeight: "800" }}>
                          {editingTask.id ? `Topshiriqni tahrirlash: ${editingTask.title}` : "Yangi topshiriq qo'shish"}
                        </h4>
                        <button type="button" className="btn btn-ghost" onClick={() => setEditingTask(null)}>
                          Bekor qilish
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Sarlavha:</label>
                          <input
                            type="text"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            required
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Yo'nalish:</label>
                          <select
                            value={taskForm.track_slug}
                            onChange={(e) => setTaskForm({ ...taskForm, track_slug: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                          >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Dasturlash tili:</label>
                          <select
                            value={taskForm.language}
                            onChange={(e) => setTaskForm({ ...taskForm, language: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Ball:</label>
                          <input
                            type="number"
                            value={taskForm.points}
                            onChange={(e) => setTaskForm({ ...taskForm, points: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Yo'riqnoma va tushuntirish:</label>
                        <textarea
                          rows={4}
                          value={taskForm.instructions}
                          onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Boshlang'ich kod (Starter Code):</label>
                          <textarea
                            rows={5}
                            value={taskForm.starter_code}
                            onChange={(e) => setTaskForm({ ...taskForm, starter_code: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>To'g'ri yechim (Solution Code - maxfiy):</label>
                          <textarea
                            rows={5}
                            value={taskForm.solution_code}
                            onChange={(e) => setTaskForm({ ...taskForm, solution_code: e.target.value })}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)" }}>Checker sozlamalari (JSON formatda testlar):</label>
                        <textarea
                          rows={6}
                          value={taskForm.checker_json}
                          onChange={(e) => setTaskForm({ ...taskForm, checker_json: e.target.value })}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingTask(null)}>
                          Bekor qilish
                        </button>
                        <button type="submit" className="btn btn-primary">
                          💾 Saqlash
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: SUBMISSIONS */}
              {activeTab === "submissions" && (
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "14px" }}>
                    Talabalar tomonidan topshirilgan yechimlar ({submissions.length})
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          background: "var(--bg-card-secondary)",
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                          fontSize: "13px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span>{sub.passed ? "✅" : "❌"}</span>
                          <strong>{sub.user_name}</strong>
                          <span style={{ color: "var(--text-muted)" }}>•</span>
                          <span style={{ color: "var(--text-secondary)" }}>{sub.task_id}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            ({new Date(sub.created_at).toLocaleTimeString()})
                          </span>
                        </div>

                        <button
                          className="btn btn-secondary"
                          onClick={() => setSelectedSub(sub)}
                          style={{ fontSize: "12px", padding: "4px 10px" }}
                        >
                          Kodni ko'rish
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedSub && (
                    <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
                      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
                        <div className="modal-header">
                          <h4 style={{ fontWeight: "800" }}>{selectedSub.user_name} ning topshirig'i</h4>
                          <button className="btn btn-ghost" onClick={() => setSelectedSub(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                          <div style={{ marginBottom: "12px" }}>
                            <strong>Topshirilgan kod:</strong>
                            <pre style={{ background: "var(--bg-card-secondary)", padding: "12px", borderRadius: "8px", overflowX: "auto", fontSize: "12px", marginTop: "4px" }}>
                              {selectedSub.code}
                            </pre>
                          </div>
                          {selectedSub.ai_feedback && (
                            <div>
                              <strong>AI Ustoz taqrizi:</strong>
                              <div style={{ background: "var(--bg-card-secondary)", padding: "12px", borderRadius: "8px", whiteSpace: "pre-wrap", fontSize: "12px", marginTop: "4px" }}>
                                {selectedSub.ai_feedback}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CERTIFICATES */}
              {activeTab === "certificates" && (
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "14px" }}>
                    Berilgan sertifikatlar registri ({certificates.length})
                  </h4>

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
                          <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                            🎓 {cert.user_name} — {cert.track_title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            ID: <strong style={{ color: "var(--blue-500)" }}>{cert.id}</strong> • Sana: {new Date(cert.created_at).toLocaleDateString()} • Ball: {cert.score}/{cert.total_score}
                          </div>
                        </div>

                        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--badge-green)", background: "var(--badge-green-bg)", padding: "4px 8px", borderRadius: "6px" }}>
                          Tasdiqlangan
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === "settings" && (
                <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "800" }}>⚙️ AI Ustoz va Tizim Sozlamalari</h4>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                      Google Gemini API Kaliti:
                    </label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                    />
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Kalit kiritilmasa, TH Mind o'rnatilgan lokal AI ustozidan foydalanadi. Kalit kiritilsa, haqiqiy Google Gemini orqali chuqur tahlil beriladi.
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="useRealAiCheck"
                      checked={useRealAi}
                      onChange={(e) => setUseRealAi(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <label htmlFor="useRealAiCheck" style={{ fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}>
                      Haqiqiy Gemini AI modelidan foydalanishni yoqish
                    </label>
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                      Gemini Modeli:
                    </label>
                    <select
                      value={geminiModel}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tez va aniq)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Eng so'nggi)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Eng yuqori aql)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                      AI Ustozi Tizimli Ko'rsatmasi (System Prompt):
                    </label>
                    <textarea
                      rows={3}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "12px" }}
                    />
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                      Yangi Admin Paroli (ixtiyoriy):
                    </label>
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Parolni o'zgartirish uchun yangisini yozing..."
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "var(--bg-card-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                    />
                  </div>

                  {settingsSavedMsg && (
                    <div style={{ color: "var(--badge-green)", fontWeight: "700", fontSize: "13px" }}>
                      ✅ {settingsSavedMsg}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button type="submit" className="btn btn-primary">
                      💾 Sozlamalarni Saqlash
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={handleResetDb} style={{ color: "var(--red-500)" }}>
                      ⚠️ Bazani zavod holatiga qaytarish (Reset)
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
