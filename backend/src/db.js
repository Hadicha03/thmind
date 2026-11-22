import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { catalog } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "db.json");

function ensureDirectory() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function buildCatalogData() {
  const tracks = [];
  const modules = [];
  const tasks = [];

  catalog.forEach((catTrack, tIdx) => {
    const trackId = `track-${catTrack.slug || tIdx + 1}`;
    tracks.push({
      id: trackId,
      slug: catTrack.slug,
      title: catTrack.title,
      summary: catTrack.summary,
      description: catTrack.description,
      track: catTrack.track,
      level: catTrack.level || "Boshlang'ich",
      sort_order: catTrack.sort_order || tIdx + 1,
    });

    (catTrack.modules || []).forEach((mod, mIdx) => {
      const moduleId = `mod-${catTrack.slug}-${mIdx + 1}`;
      modules.push({
        id: moduleId,
        track_id: trackId,
        track_slug: catTrack.slug,
        title: mod.title,
        summary: mod.summary,
        sort_order: mod.sort_order || mIdx + 1,
      });

      (mod.tasks || []).forEach((tsk, kIdx) => {
        const taskId = `task-${catTrack.slug}-${mIdx + 1}-${kIdx + 1}`;
        tasks.push({
          id: taskId,
          module_id: moduleId,
          track_id: trackId,
          track_slug: catTrack.slug,
          title: tsk.title,
          language: tsk.language || "javascript",
          points: tsk.points || 10,
          sort_order: tsk.sort_order || kIdx + 1,
          starter_code: tsk.starter_code || "",
          solution_code: tsk.solution_code || "",
          theory: tsk.theory || "",
          instructions: tsk.instructions || "",
          checker: tsk.checker || {},
        });
      });
    });
  });

  return { tracks, modules, tasks };
}

function buildInitialData() {
  const { tracks, modules, tasks } = buildCatalogData();
  return {
    tracks,
    modules,
    tasks,
    users: [
      {
        id: "admin-1",
        email: "admin@thmind.uz",
        name: "TH Mind Admin",
        role: "admin",
      },
    ],
    submissions: [],
    certificates: [],
    settings: {
      gemini_api_key: "",
      gemini_model: "gemini-1.5-flash",
      use_real_ai: false,
      admin_password: "admin", // default easy admin password
      system_prompt:
        "Siz TH Mind platformasining mehribon, tajribali va do'stona AI ustozisiz. O'quvchilarga xatolarini o'zbek tilida aniq, tushunarli va rag'batlantiruvchi tarzda tushuntirib bering.",
    },
  };
}

function stripSecrets(task) {
  const { solution_code, ...rest } = task;
  if (rest.language === "quiz" && Array.isArray(rest.checker?.questions)) {
    rest.checker = {
      ...rest.checker,
      questions: rest.checker.questions.map(({ q, options }) => ({ q, options })),
    };
  }
  return rest;
}

function trackIdFor(slug) {
  return `track-${slug || "frontend"}`;
}

class Database {
  constructor() {
    ensureDirectory();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, "utf-8");
        this.data = JSON.parse(raw);
        if (!this.data.tracks || !this.data.tasks || this.data.tasks.length === 0) {
          this.data = buildInitialData();
          this.save();
        } else if (this.addMissingCatalogTracks()) {
          this.save();
        }
      } else {
        this.data = buildInitialData();
        this.save();
      }
    } catch (err) {
      console.error("Ma'lumotlar bazasini o'qishda xatolik, qayta tiklanmoqda:", err);
      this.data = buildInitialData();
      this.save();
    }
  }

  // Adds catalog tracks (e.g. newly released courses) that are missing from an existing database
  addMissingCatalogTracks() {
    const fresh = buildCatalogData();
    const existing = new Set(this.data.tracks.map((t) => t.slug));
    const missing = fresh.tracks.filter((t) => !existing.has(t.slug));
    if (!missing.length) return false;
    const slugs = new Set(missing.map((t) => t.slug));
    this.data.tracks.push(...missing);
    this.data.modules.push(...fresh.modules.filter((m) => slugs.has(m.track_slug)));
    this.data.tasks.push(...fresh.tasks.filter((t) => slugs.has(t.track_slug)));
    return true;
  }

  save() {
    try {
      ensureDirectory();
      const tmpPath = `${dbPath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), "utf-8");
      fs.renameSync(tmpPath, dbPath);
    } catch (err) {
      console.error("Ma'lumotlar bazasini saqlashda xatolik:", err);
    }
  }

  reset() {
    this.data = buildInitialData();
    this.save();
    return this.data;
  }

  // Tracks & Modules & Tasks
  getTracks() {
    return this.data.tracks.sort((a, b) => a.sort_order - b.sort_order);
  }

  getTrackBySlug(slug) {
    return this.data.tracks.find((t) => t.slug === slug);
  }

  getModulesByTrackSlug(slug) {
    return this.data.modules
      .filter((m) => m.track_slug === slug)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  getTasksByTrackSlug(slug, includeSecrets = false) {
    return this.data.tasks
      .filter((t) => t.track_slug === slug)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((t) => {
        if (includeSecrets) return t;
        return stripSecrets(t);
      });
  }

  getAllTasks(includeSecrets = false) {
    return this.data.tasks.map((t) => {
      if (includeSecrets) return t;
      return stripSecrets(t);
    });
  }

  getTaskById(id, includeSecrets = false) {
    const task = this.data.tasks.find((t) => t.id === id);
    if (!task) return null;
    if (includeSecrets) return task;
    return stripSecrets(task);
  }

  createTask(taskData) {
    const id = taskData.id || `task-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const newTask = {
      id,
      module_id: taskData.module_id || "mod-custom",
      track_id: taskData.track_id || trackIdFor(taskData.track_slug),
      track_slug: taskData.track_slug || "frontend",
      title: taskData.title || "Yangi topshiriq",
      language: taskData.language || "javascript",
      points: Number(taskData.points) || 10,
      sort_order: Number(taskData.sort_order) || this.data.tasks.length + 1,
      starter_code: taskData.starter_code || "",
      solution_code: taskData.solution_code || "",
      theory: taskData.theory || "",
      instructions: taskData.instructions || "",
      checker: taskData.checker || {},
    };
    this.data.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id, taskData) {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.data.tasks[index] = {
      ...this.data.tasks[index],
      ...taskData,
      id, // keep ID invariant
    };
    this.save();
    return this.data.tasks[index];
  }

  deleteTask(id) {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.data.tasks.splice(index, 1);
    this.save();
    return true;
  }

  // Users & Student Auth
  findUserByEmail(email) {
    if (!email) return null;
    const clean = String(email).trim().toLowerCase();
    return (this.data.users || []).find((u) => u.email?.toLowerCase() === clean) || null;
  }

  findUserById(id) {
    return (this.data.users || []).find((u) => u.id === id) || null;
  }

  registerUser({ name, email, password }) {
    if (!this.data.users) this.data.users = [];
    const cleanEmail = String(email || "").trim().toLowerCase();
    const existing = this.findUserByEmail(cleanEmail);
    if (existing) {
      return { error: "Ushbu email allaqachon ro'yxatdan o'tgan. Iltimos, tizimga kiring." };
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(String(password || ""), salt);

    const newUser = {
      id: `student-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      name: String(name || "Dasturchi").trim(),
      email: cleanEmail,
      password_hash,
      role: "student",
      created_at: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.save();

    const { password_hash: _, ...safeUser } = newUser;
    return { user: safeUser };
  }

  authenticateUser(email, password) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const user = this.findUserByEmail(cleanEmail);
    if (!user) {
      return { error: "Bunday email bilan hisob topilmadi. Avval ro'yxatdan o'ting." };
    }

    if (!user.password_hash) {
      return { error: "Foydalanuvchi paroli sozlanmagan." };
    }

    const match = bcrypt.compareSync(String(password || ""), user.password_hash);
    if (!match) {
      return { error: "Xato parol kiritildi! Iltimos, qaytadan tekshirib yozing." };
    }

    const { password_hash: _, ...safeUser } = user;
    return { user: safeUser };
  }

  getAllUsers() {
    return (this.data.users || []).map((u) => {
      const { password_hash, ...safe } = u;
      return safe;
    });
  }

  // Modules CRUD
  createModule(moduleData) {
    const id = moduleData.id || `mod-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    const newMod = {
      id,
      track_id: moduleData.track_id || trackIdFor(moduleData.track_slug),
      track_slug: moduleData.track_slug || "frontend",
      title: moduleData.title || "Yangi modul",
      summary: moduleData.summary || "",
      sort_order: Number(moduleData.sort_order) || this.data.modules.length + 1,
    };
    this.data.modules.push(newMod);
    this.save();
    return newMod;
  }

  // Submissions
  addSubmission(sub) {
    const newSub = {
      id: `sub-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      user_id: sub.user_id || "guest",
      user_name: sub.user_name || "Mehmon",
      task_id: sub.task_id,
      track_slug: sub.track_slug,
      code: sub.code,
      passed: Boolean(sub.passed),
      test_results: sub.test_results || [],
      ai_feedback: sub.ai_feedback || null,
      created_at: new Date().toISOString(),
    };
    this.data.submissions.unshift(newSub);
    // keep latest 500 submissions
    if (this.data.submissions.length > 500) {
      this.data.submissions = this.data.submissions.slice(0, 500);
    }
    this.save();
    return newSub;
  }

  getSubmissions(limit = 100, trackSlug = null) {
    let list = this.data.submissions;
    if (trackSlug) {
      list = list.filter((s) => s.track_slug === trackSlug);
    }
    return list.slice(0, limit);
  }

  getUserProgress(userId, trackSlug = null) {
    const userSubs = this.data.submissions.filter((s) => s.user_id === userId && s.passed);
    const passedTaskIds = [...new Set(userSubs.map((s) => s.task_id))];

    const tracks = this.getTracks();
    const progressByTrack = {};

    tracks.forEach((t) => {
      const trackTasks = this.data.tasks.filter((task) => task.track_slug === t.slug);
      const total = trackTasks.length;
      const completed = trackTasks.filter((task) => passedTaskIds.includes(task.id)).length;
      const totalPoints = trackTasks.reduce((acc, cur) => acc + (cur.points || 10), 0);
      const earnedPoints = trackTasks
        .filter((task) => passedTaskIds.includes(task.id))
        .reduce((acc, cur) => acc + (cur.points || 10), 0);

      progressByTrack[t.slug] = {
        track_slug: t.slug,
        title: t.title,
        total_tasks: total,
        completed_tasks: completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        total_points: totalPoints,
        earned_points: earnedPoints,
        is_completed: total > 0 && completed === total,
      };
    });

    return {
      passed_tasks: passedTaskIds,
      progress_by_track: progressByTrack,
    };
  }

  // Certificates
  issueCertificate({ userId, userName, trackSlug }) {
    const track = this.getTrackBySlug(trackSlug);
    if (!track) return { error: "Bunday yo'nalish topilmadi" };

    const progress = this.getUserProgress(userId, trackSlug);
    const trackProgress = progress.progress_by_track[trackSlug];

    if (!trackProgress || !trackProgress.is_completed) {
      return {
        error: `Sertifikat olish uchun barcha ${trackProgress?.total_tasks || 0} ta topshiriqni to'liq bajarishingiz kerak! Hozir: ${trackProgress?.completed_tasks || 0}/${trackProgress?.total_tasks || 0}`,
      };
    }

    // Check if certificate already exists
    const existing = this.data.certificates.find(
      (c) => c.user_id === userId && c.track_slug === trackSlug,
    );
    if (existing) {
      return { certificate: existing, is_new: false };
    }

    const certId = `THM-${trackSlug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert = {
      id: certId,
      user_id: userId,
      user_name: userName || "O'quvchi",
      track_slug: trackSlug,
      track_title: track.title,
      score: trackProgress.earned_points,
      total_score: trackProgress.total_points,
      total_tasks: trackProgress.total_tasks,
      grade: "A'lo (100%)",
      created_at: new Date().toISOString(),
      verified: true,
      issuer: "TH Mind IT Akademiyasi",
      instructor: "TH Mind Katta Dasturchilar Hay'ati",
    };

    this.data.certificates.unshift(newCert);
    this.save();
    return { certificate: newCert, is_new: true };
  }

  getCertificates(userId = null) {
    if (userId) {
      return this.data.certificates.filter((c) => c.user_id === userId);
    }
    return this.data.certificates;
  }

  getCertificateById(id) {
    return this.data.certificates.find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  // Settings
  getSettings() {
    return {
      gemini_api_key_configured: Boolean(this.data.settings?.gemini_api_key),
      gemini_model: this.data.settings?.gemini_model || "gemini-1.5-flash",
      use_real_ai: Boolean(this.data.settings?.use_real_ai && this.data.settings?.gemini_api_key),
      system_prompt: this.data.settings?.system_prompt || "",
    };
  }

  getFullSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
    };
    this.save();
    return this.getSettings();
  }
}

export const db = new Database();
