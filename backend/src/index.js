import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";
import { runChecks, validateSpec } from "./checker.js";
import { analyzeCodeWithAi } from "./ai.js";

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "127.0.0.1";
const MASTER_KEY = process.env.ADMIN_MASTER_KEY || "";
const isMasterKey = (value) => Boolean(MASTER_KEY) && value === MASTER_KEY;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (!req.path.startsWith("/api/health")) {
      const ms = Date.now() - start;
      console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${ms}ms)`);
    }
  });
  next();
});

// Admin authorization middleware
function requireAdmin(req, res, next) {
  const adminPassHeader = req.headers["x-admin-password"];
  const authHeader = req.headers.authorization;
  const currentSettings = db.getFullSettings();
  const validPassword = currentSettings.admin_password || "admin";

  let provided = adminPassHeader;
  if (!provided && authHeader && authHeader.startsWith("Bearer ")) {
    provided = authHeader.slice(7).trim();
  }

  if (provided === validPassword || isMasterKey(provided)) {
    return next();
  }

  return res.status(401).json({ error: "Admin ruxsati talab qilinadi. Parol noto'g'ri." });
}

// ==========================================
// PUBLIC & STUDENT API
// ==========================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "ready", timestamp: new Date().toISOString() });
});

// List tracks
app.get("/api/tracks", (req, res) => {
  const tracks = db.getTracks();
  const allTasks = db.getAllTasks(false);

  const enriched = tracks.map((t) => {
    const trackTasks = allTasks.filter((task) => task.track_slug === t.slug);
    const totalPoints = trackTasks.reduce((acc, cur) => acc + (cur.points || 10), 0);
    return {
      ...t,
      tasks_count: trackTasks.length,
      total_points: totalPoints,
    };
  });

  res.json(enriched);
});

// Get track detail with modules and tasks
app.get("/api/tracks/:slug", (req, res) => {
  const { slug } = req.params;
  const track = db.getTrackBySlug(slug);
  if (!track) {
    return res.status(404).json({ error: "Bunday yo'nalish topilmadi" });
  }

  const modules = db.getModulesByTrackSlug(slug);
  const tasks = db.getTasksByTrackSlug(slug, false);

  const modulesWithTasks = modules.map((m) => {
    return {
      ...m,
      tasks: tasks.filter((t) => t.module_id === m.id),
    };
  });

  res.json({
    track,
    modules: modulesWithTasks,
    total_tasks: tasks.length,
    total_points: tasks.reduce((sum, t) => sum + (t.points || 10), 0),
  });
});

// Get single task
app.get("/api/tasks/:id", (req, res) => {
  const task = db.getTaskById(req.params.id, false);
  if (!task) {
    return res.status(404).json({ error: "Topshiriq topilmadi" });
  }
  res.json(task);
});

// Submit code for checking and AI review
app.post("/api/tasks/:id/check", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, userId = "student-1", userName = "O'quvchi" } = req.body;

    const task = db.getTaskById(id, true);
    if (!task) {
      return res.status(404).json({ error: "Topshiriq topilmadi" });
    }

    if (typeof code !== "string") {
      return res.status(400).json({ error: "Kod matni talab qilinadi" });
    }

    // 1. Run automated unit tests
    const testResult = runChecks(task.language, code, task.checker);

    // 2. Run AI Tutor analysis
    const aiResult = await analyzeCodeWithAi({
      language: task.language,
      code,
      task,
      testResult,
    });

    // 3. Save submission
    const submission = db.addSubmission({
      user_id: userId,
      user_name: userName,
      task_id: task.id,
      track_slug: task.track_slug,
      code,
      passed: testResult.passed,
      test_results: testResult.tests,
      ai_feedback: aiResult.analysis,
    });

    // 4. Check user overall track progress
    const userProgress = db.getUserProgress(userId, task.track_slug);
    const trackProgress = userProgress.progress_by_track[task.track_slug];
    const courseCompleted = Boolean(trackProgress?.is_completed);

    res.json({
      passed: testResult.passed,
      test_results: testResult.tests,
      explanation: testResult.explanation,
      ai_analysis: aiResult.analysis,
      ai_source: aiResult.source,
      ai_warning: aiResult.warning || null,
      points_earned: testResult.passed ? task.points : 0,
      score: testResult.score || null,
      course_completed: courseCompleted,
      track_progress: trackProgress,
      submission_id: submission.id,
    });
  } catch (err) {
    console.error("Tekshirishda xatolik:", err);
    res.status(500).json({ error: "Tekshiruv tizimida xatolik yuz berdi: " + err.message });
  }
});

// Ask AI for help / hints
app.post("/api/tasks/:id/ai-help", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, question = "" } = req.body;

    const task = db.getTaskById(id, false);
    if (!task) {
      return res.status(404).json({ error: "Topshiriq topilmadi" });
    }

    const testResult = runChecks(task.language, code || task.starter_code, task.checker);
    const aiResult = await analyzeCodeWithAi({
      language: task.language,
      code: code || task.starter_code,
      task,
      testResult,
      studentQuestion: question,
    });

    res.json({
      ai_analysis: aiResult.analysis,
      ai_source: aiResult.source,
    });
  } catch (err) {
    console.error("AI yordam xatosi:", err);
    res.status(500).json({ error: "AI javob berishda xatolik: " + err.message });
  }
});

// Get user progress
app.get("/api/progress/:userId", (req, res) => {
  const { userId } = req.params;
  const progress = db.getUserProgress(userId);
  res.json(progress);
});

// Claim certificate
app.post("/api/certificates/claim", (req, res) => {
  const { userId, userName, trackSlug } = req.body;
  if (!userId || !trackSlug) {
    return res.status(400).json({ error: "userId va trackSlug talab qilinadi" });
  }

  const result = db.issueCertificate({
    userId,
    userName: (userName || "").trim() || "O'quvchi",
    trackSlug,
  });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
});

// Verify certificate by ID
app.get("/api/certificates/:id", (req, res) => {
  const cert = db.getCertificateById(req.params.id);
  if (!cert) {
    return res.status(404).json({ error: "Sertifikat topilmadi yoki haqiqiy emas." });
  }
  res.json(cert);
});

// List certificates
app.get("/api/certificates", (req, res) => {
  const { userId } = req.query;
  const list = db.getCertificates(userId || null);
  res.json(list);
});

// ==========================================
// ADMIN API
// ==========================================

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const currentSettings = db.getFullSettings();
  const validPassword = currentSettings.admin_password || "admin";

  if (password === validPassword || isMasterKey(password)) {
    return res.json({
      success: true,
      message: "Admin tizimiga xush kelibsiz",
      token: validPassword,
    });
  }

  return res.status(401).json({ error: "Parol noto'g'ri. Qaytadan urinib ko'ring." });
});

// Admin stats
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const tasks = db.getAllTasks(true);
  const submissions = db.getSubmissions(500);
  const certificates = db.getCertificates();
  const tracks = db.getTracks();

  const totalSubs = submissions.length;
  const passedSubs = submissions.filter((s) => s.passed).length;
  const uniqueStudents = new Set(submissions.map((s) => s.user_id)).size;

  res.json({
    total_tracks: tracks.length,
    total_tasks: tasks.length,
    frontend_tasks: tasks.filter((t) => t.track_slug === "frontend").length,
    backend_tasks: tasks.filter((t) => t.track_slug === "backend").length,
    savodxonlik_tasks: tasks.filter((t) => t.track_slug === "savodxonlik").length,
    total_submissions: totalSubs,
    passed_submissions: passedSubs,
    failed_submissions: totalSubs - passedSubs,
    success_rate: totalSubs > 0 ? Math.round((passedSubs / totalSubs) * 100) : 0,
    total_certificates: certificates.length,
    unique_students: uniqueStudents || 1,
  });
});

// Admin: all tasks with full test details
app.get("/api/admin/tasks", requireAdmin, (req, res) => {
  const tasks = db.getAllTasks(true);
  res.json(tasks);
});

// Admin: create task
app.post("/api/admin/tasks", requireAdmin, (req, res) => {
  try {
    const { title, track_slug, module_id, language, points, starter_code, solution_code, instructions, checker } = req.body;
    if (!title || !track_slug || !language) {
      return res.status(400).json({ error: "Sarlavha, yo'nalish va til majburiy" });
    }

    if (checker) {
      const err = validateSpec(language, checker);
      if (err) return res.status(400).json({ error: `Checker xatosi: ${err}` });
    }

    const created = db.createTask(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update task
app.put("/api/admin/tasks/:id", requireAdmin, (req, res) => {
  try {
    const { language, checker } = req.body;
    if (language && checker) {
      const err = validateSpec(language, checker);
      if (err) return res.status(400).json({ error: `Checker xatosi: ${err}` });
    }

    const updated = db.updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Topshiriq topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete task
app.delete("/api/admin/tasks/:id", requireAdmin, (req, res) => {
  const ok = db.deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: "Topshiriq topilmadi" });
  res.json({ success: true, message: "Topshiriq muvaffaqiyatli o'chirildi" });
});

// Admin: get recent submissions
app.get("/api/admin/submissions", requireAdmin, (req, res) => {
  const { track } = req.query;
  const submissions = db.getSubmissions(200, track || null);
  res.json(submissions);
});

// Admin: get all certificates
app.get("/api/admin/certificates", requireAdmin, (req, res) => {
  const list = db.getCertificates();
  res.json(list);
});

// Admin: get settings
app.get("/api/admin/settings", requireAdmin, (req, res) => {
  const settings = db.getFullSettings();
  res.json({
    gemini_api_key: settings.gemini_api_key ? "••••••••" + settings.gemini_api_key.slice(-4) : "",
    has_api_key: Boolean(settings.gemini_api_key),
    gemini_model: settings.gemini_model || "gemini-1.5-flash",
    use_real_ai: Boolean(settings.use_real_ai),
    system_prompt: settings.system_prompt,
  });
});

// Admin: update settings
app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const { gemini_api_key, gemini_model, use_real_ai, system_prompt, new_admin_password } = req.body;
  const toUpdate = {};

  if (typeof gemini_api_key === "string" && gemini_api_key && !gemini_api_key.startsWith("••••")) {
    toUpdate.gemini_api_key = gemini_api_key.trim();
  } else if (gemini_api_key === "") {
    toUpdate.gemini_api_key = "";
  }

  if (gemini_model) toUpdate.gemini_model = gemini_model;
  if (typeof use_real_ai === "boolean") toUpdate.use_real_ai = use_real_ai;
  if (typeof system_prompt === "string") toUpdate.system_prompt = system_prompt;
  if (new_admin_password && new_admin_password.trim().length >= 3) {
    toUpdate.admin_password = new_admin_password.trim();
  }

  const updated = db.updateSettings(toUpdate);
  res.json({ success: true, settings: updated });
});

// Admin: reset to seed defaults
app.post("/api/admin/reset", requireAdmin, (req, res) => {
  db.reset();
  res.json({ success: true, message: "Ma'lumotlar bazasi standart holatga qaytarildi" });
});

process.on("uncaughtException", (err) => {
  console.error("⚠️ [Kutilmagan xatolik (uncaughtException)]:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ [Kutilmagan rad etish (unhandledRejection)]:", reason);
});

// Production: serve the built frontend (npm run build) from the same server
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../frontend/dist");
if (fs.existsSync(path.join(distDir, "index.html"))) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(distDir, "index.html")));
}

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 TH Mind Backend serveri ishga tushdi: http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} allaqachon band qilingan!`);
  } else {
    console.error("❌ Server xatoligi:", err);
  }
});
