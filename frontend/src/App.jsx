import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header.jsx";
import TrackHeader from "./components/TrackHeader.jsx";
import ModuleSidebar from "./components/ModuleSidebar.jsx";
import Workspace from "./components/Workspace.jsx";
import CertificateModal from "./components/CertificateModal.jsx";
import CertificateVerifyModal from "./components/CertificateVerifyModal.jsx";
import AdminModal from "./components/AdminModal.jsx";
import AuthPage from "./components/AuthPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Landing from "./components/Landing.jsx";
import Footer from "./components/Footer.jsx";
import { api, getToken, setToken } from "./api.js";

export default function App() {
  // Theme (Dark / Light)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("thmind-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("thmind-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Auth
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      setAuthChecked(true);
      return;
    }
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(""))
      .finally(() => setAuthChecked(true));
  }, []);

  const handleAuthenticated = ({ user: u, token }) => {
    setToken(token);
    setUser(u);
    setAuthMode(null);
    setView("dashboard");
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setToken("");
    setUser(null);
    setPassedTaskIds([]);
    setProgressByTrack({});
    setCertificates([]);
  };

  const handleSaveName = async (name) => {
    const data = await api("/api/auth/profile", { method: "PUT", body: { name } });
    setUser(data.user);
  };

  // Navigation: "dashboard" (profile + courses) or "course"
  const [view, setView] = useState("dashboard");
  const [tracks, setTracks] = useState([]);
  const [currentTrackSlug, setCurrentTrackSlug] = useState(
    () => localStorage.getItem("thmind_last_track") || "frontend"
  );
  const [trackData, setTrackData] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Progress & certificates
  const [passedTaskIds, setPassedTaskIds] = useState([]);
  const [progressByTrack, setProgressByTrack] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);

  // Workspace
  const [isChecking, setIsChecking] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Modals
  const [showCertModal, setShowCertModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      const data = await api("/api/progress/me");
      setPassedTaskIds(data.passed_tasks || []);
      setProgressByTrack(data.progress_by_track || {});
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCertificates = useCallback(async () => {
    try {
      setCertificates(await api("/api/certificates/me"));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTrack = async (slug) => {
    setIsLoadingTrack(true);
    setFetchError("");
    try {
      const data = await api(`/api/tracks/${slug}`);
      setTrackData(data);
      const allTasks = (data.modules || []).flatMap((m) => m.tasks || []);
      if (allTasks.length > 0 && (!currentTask || currentTask.track_slug !== slug)) {
        setCurrentTask(allTasks.find((t) => !passedTaskIds.includes(t.id)) || allTasks[0]);
      }
      setLastResult(null);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoadingTrack(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProgress();
    fetchCertificates();
    api("/api/tracks").then(setTracks).catch((err) => setFetchError(err.message));
  }, [user?.id]);

  useEffect(() => {
    if (user && view === "course") fetchTrack(currentTrackSlug);
  }, [currentTrackSlug, view, user?.id]);

  const openTrack = (slug) => {
    localStorage.setItem("thmind_last_track", slug);
    if (slug !== currentTrackSlug) {
      setCurrentTask(null);
      setTrackData(null);
    }
    setCurrentTrackSlug(slug);
    setView("course");
    window.scrollTo(0, 0);
  };

  const handleCheckCode = async (code) => {
    if (!currentTask) return;
    setIsChecking(true);
    try {
      const data = await api(`/api/tasks/${currentTask.id}/check`, { method: "POST", body: { code } });
      setLastResult(data);
      if (data.passed) {
        setPassedTaskIds((prev) => [...new Set([...prev, currentTask.id])]);
        await fetchProgress();
        if (data.course_completed) setTimeout(() => setShowCertModal(true), 800);
      }
    } catch (err) {
      if (err.status === 401) handleLogout();
      alert("Tekshirishda xatolik yuz berdi: " + err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAskAiHelp = (code, question) =>
    api(`/api/tasks/${currentTask.id}/ai-help`, { method: "POST", body: { code, question } });

  const handleClaimCertificate = async (customName, trackSlug) => {
    const data = await api("/api/certificates/claim", {
      method: "POST",
      body: { userName: customName, trackSlug },
    });
    fetchCertificates();
    return data;
  };

  if (!authChecked) {
    return <div className="splash">Yuklanmoqda...</div>;
  }

  if (!user) {
    if (authMode) {
      return (
        <AuthPage
          key={authMode}
          initialMode={authMode}
          onAuthenticated={handleAuthenticated}
          onBack={() => setAuthMode(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    }
    return (
      <>
        <Landing
          theme={theme}
          onToggleTheme={toggleTheme}
          onAuth={(mode) => {
            setAuthMode(mode);
            window.scrollTo(0, 0);
          }}
          onOpenVerify={() => setShowVerifyModal(true)}
        />
        {showVerifyModal && <CertificateVerifyModal onClose={() => setShowVerifyModal(false)} />}
      </>
    );
  }

  const currentTrackProgress = progressByTrack[currentTrackSlug] || {
    total_tasks: trackData?.total_tasks || 0,
    completed_tasks: 0,
    percentage: 0,
  };
  const existingCertForCurrentTrack = certificates.find((c) => c.track_slug === currentTrackSlug);
  const totalUserPoints = Object.values(progressByTrack).reduce((acc, cur) => acc + (cur.earned_points || 0), 0);

  return (
    <div className={`app-shell view-${view}`}>
      <Header
        user={user}
        userPoints={totalUserPoints}
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={() => setView("dashboard")}
        onOpenVerify={() => setShowVerifyModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onLogout={handleLogout}
      />

      {fetchError && (
        <div className="error-banner">
          <span>⚠️ Serverga ulanishda xatolik: {fetchError}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => (view === "course" ? fetchTrack(currentTrackSlug) : window.location.reload())}>
            🔄 Qayta urinish
          </button>
        </div>
      )}

      {view === "dashboard" ? (
        <>
        <Dashboard
          user={user}
          tracks={tracks}
          progressByTrack={progressByTrack}
          certificates={certificates}
          totalPoints={totalUserPoints}
          passedCount={passedTaskIds.length}
          onOpenTrack={openTrack}
          onSaveName={handleSaveName}
          onViewCertificate={(cert) => {
            setSelectedCertForModal(cert);
            setShowCertModal(true);
          }}
        />
        <Footer tracks={tracks} onOpenTrack={openTrack} onOpenVerify={() => setShowVerifyModal(true)} />
        </>
      ) : (
        <>
          <TrackHeader
            track={trackData?.track}
            tracks={tracks}
            progress={currentTrackProgress}
            onBack={() => setView("dashboard")}
            onSelectTrack={openTrack}
          />

          <div className="workspace-layout">
            <ModuleSidebar
              trackSlug={currentTrackSlug}
              modules={trackData?.modules}
              currentTaskId={currentTask?.id}
              passedTaskIds={passedTaskIds}
              progress={currentTrackProgress}
              hasCertificate={Boolean(existingCertForCurrentTrack)}
              onSelectTask={(task) => {
                setCurrentTask(task);
                setLastResult(null);
                if (window.matchMedia("(max-width: 900px)").matches) {
                  setTimeout(() => document.querySelector(".editor-main-area")?.scrollIntoView({ behavior: "smooth" }), 50);
                }
              }}
              onOpenCertificate={() => {
                setSelectedCertForModal(existingCertForCurrentTrack || null);
                setShowCertModal(true);
              }}
              onRetry={() => fetchTrack(currentTrackSlug)}
            />

            {currentTask ? (
              <Workspace
                task={currentTask}
                isPassed={passedTaskIds.includes(currentTask.id)}
                onCheckCode={handleCheckCode}
                isChecking={isChecking}
                lastResult={lastResult}
                onAskAiHelp={handleAskAiHelp}
              />
            ) : (
              <div className="empty-state">
                {isLoadingTrack ? "Darslar yuklanmoqda..." : "Ro'yxatdan dars tanlang"}
              </div>
            )}
          </div>
        </>
      )}

      {showCertModal && (
        <CertificateModal
          certificate={selectedCertForModal || existingCertForCurrentTrack}
          trackSlug={selectedCertForModal?.track_slug || currentTrackSlug}
          trackTitle={selectedCertForModal?.track_title || trackData?.track?.title}
          userName={user.name}
          onClose={() => setShowCertModal(false)}
          onClaim={handleClaimCertificate}
        />
      )}

      {showVerifyModal && <CertificateVerifyModal onClose={() => setShowVerifyModal(false)} />}

      {showAdminModal && (
        <AdminModal onClose={() => setShowAdminModal(false)} onRefreshTracks={() => view === "course" && fetchTrack(currentTrackSlug)} />
      )}
    </div>
  );
}
