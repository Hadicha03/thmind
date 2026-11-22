import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import TrackHeader from "./components/TrackHeader.jsx";
import ModuleSidebar from "./components/ModuleSidebar.jsx";
import Workspace from "./components/Workspace.jsx";
import CertificateModal from "./components/CertificateModal.jsx";
import CertificateVerifyModal from "./components/CertificateVerifyModal.jsx";
import UserProfileModal from "./components/UserProfileModal.jsx";
import AdminModal from "./components/AdminModal.jsx";

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Student Profile
  const [userId] = useState(() => {
    let id = localStorage.getItem("thmind_user_id");
    if (!id) {
      id = "student-" + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("thmind_user_id", id);
    }
    return id;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("thmind_user_name") || "Dasturchi Talaba";
  });

  const handleSaveUserName = (name) => {
    setUserName(name);
    localStorage.setItem("thmind_user_name", name);
  };

  // Tracks & Active Track
  const [currentTrackSlug, setCurrentTrackSlug] = useState("frontend");
  const [trackData, setTrackData] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // User Progress
  const [passedTaskIds, setPassedTaskIds] = useState([]);
  const [progressByTrack, setProgressByTrack] = useState({});

  // Submissions & Workspace
  const [isChecking, setIsChecking] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  // Certificates
  const [certificates, setCertificates] = useState([]);
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);

  // Modals
  const [showCertModal, setShowCertModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Fetch track details
  const fetchTrack = async (slug) => {
    setIsLoadingTrack(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/tracks/${slug}`);
      if (!res.ok) throw new Error(`Yo'nalishni yuklab bo'lmadi (Status: ${res.status})`);
      const data = await res.json();
      setTrackData(data);

      // Select first task or first incomplete task
      const allTasks = [];
      data.modules?.forEach((m) => {
        (m.tasks || []).forEach((t) => allTasks.push(t));
      });

      if (allTasks.length > 0) {
        // If currentTask doesn't belong to this track, switch to first of this track
        if (!currentTask || currentTask.track_slug !== slug) {
          const firstIncomplete = allTasks.find((t) => !passedTaskIds.includes(t.id));
          setCurrentTask(firstIncomplete || allTasks[0]);
        }
      }
      setLastResult(null);
    } catch (err) {
      console.error("fetchTrack error:", err);
      setFetchError(err.message);
    } finally {
      setIsLoadingTrack(false);
    }
  };

  // Fetch progress
  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/progress/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPassedTaskIds(data.passed_tasks || []);
        setProgressByTrack(data.progress_by_track || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user certificates
  const fetchCertificates = async () => {
    try {
      const res = await fetch(`/api/certificates?userId=${userId}`);
      if (res.ok) {
        const list = await res.json();
        setCertificates(list);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProgress();
    fetchCertificates();
  }, [userId]);

  useEffect(() => {
    fetchTrack(currentTrackSlug);
  }, [currentTrackSlug]);

  // Code Check handler
  const handleCheckCode = async (code) => {
    if (!currentTask) return;
    setIsChecking(true);
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          userId,
          userName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tekshirishda xatolik");

      setLastResult(data);

      if (data.passed) {
        setPassedTaskIds((prev) => [...new Set([...prev, currentTask.id])]);
        await fetchProgress();

        if (data.course_completed) {
          setTimeout(() => {
            setShowCertModal(true);
          }, 800);
        }
      }
    } catch (err) {
      alert("Tekshirishda xatolik yuz berdi: " + err.message);
    } finally {
      setIsChecking(false);
    }
  };

  // AI Help handler
  const handleAskAiHelp = async (code, question) => {
    if (!currentTask) return;
    const res = await fetch(`/api/tasks/${currentTask.id}/ai-help`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        userId,
        question,
      }),
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || "AI javob bera olmadi");
    }
    return await res.json();
  };

  // Claim certificate handler
  const handleClaimCertificate = async (customName, trackSlug) => {
    const res = await fetch("/api/certificates/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userName: customName,
        trackSlug,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sertifikat berishda xatolik");

    handleSaveUserName(customName);
    fetchCertificates();
    return data;
  };

  // Reset student progress
  const handleResetProgress = () => {
    if (window.confirm("Barcha erishilgan natijalaringizni tozalashga ishonchingiz komilmi?")) {
      setPassedTaskIds([]);
      setCertificates([]);
      setLastResult(null);
      localStorage.removeItem("thmind_user_id");
      window.location.reload();
    }
  };

  // Current track progress
  const currentTrackProgress = progressByTrack[currentTrackSlug] || {
    total_tasks: trackData?.total_tasks || 0,
    completed_tasks: 0,
    percentage: 0,
    total_points: trackData?.total_points || 0,
    earned_points: 0,
    is_completed: false,
  };

  const existingCertForCurrentTrack = certificates.find(
    (c) => c.track_slug === currentTrackSlug
  );

  const totalUserPoints = Object.values(progressByTrack).reduce(
    (acc, cur) => acc + (cur.earned_points || 0),
    0
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 1. Header (Red & Blue Theme, Track switcher, Actions) */}
      <Header
        currentTrack={currentTrackSlug}
        onSelectTrack={(slug) => {
          if (slug !== currentTrackSlug) {
            setCurrentTrackSlug(slug);
          }
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        userName={userName}
        userPoints={totalUserPoints}
        earnedCertificatesCount={certificates.length}
        onOpenCertificates={() => {
          if (certificates.length > 0) {
            setSelectedCertForModal(certificates[0]);
            setShowCertModal(true);
          } else {
            setShowProfileModal(true);
          }
        }}
        onOpenVerify={() => setShowVerifyModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Network error banner if any */}
      {fetchError && (
        <div style={{ background: "var(--badge-red-bg)", color: "var(--badge-red)", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
          <span>⚠️ Serverga ulanishda uzilish: {fetchError}</span>
          <button className="btn btn-secondary" onClick={() => fetchTrack(currentTrackSlug)} style={{ padding: "4px 10px", fontSize: "12px" }}>
            🔄 Qayta urinish
          </button>
        </div>
      )}

      {/* 2. Track Banner (Progress, Stats, Certificate button) */}
      <TrackHeader
        track={trackData?.track}
        progress={currentTrackProgress}
        hasCertificate={Boolean(existingCertForCurrentTrack)}
        onClaimCertificate={() => {
          if (existingCertForCurrentTrack) {
            setSelectedCertForModal(existingCertForCurrentTrack);
          } else {
            setSelectedCertForModal(null);
          }
          setShowCertModal(true);
        }}
      />

      {/* 3. Main Split View (Sidebar + Code Workspace) */}
      <div className="workspace-layout">
        {/* Module Sidebar */}
        <ModuleSidebar
          trackSlug={currentTrackSlug}
          modules={trackData?.modules}
          currentTaskId={currentTask?.id}
          passedTaskIds={passedTaskIds}
          onSelectTask={(task) => {
            setCurrentTask(task);
            setLastResult(null);
          }}
          onRetry={() => fetchTrack(currentTrackSlug)}
        />

        {/* Code Editor & AI Evaluation Workspace */}
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", gap: "12px" }}>
            <div style={{ fontSize: "36px" }}>📝</div>
            <div>{isLoadingTrack ? "Darslar yuklanmoqda..." : "Chap paneldagi topshiriqlardan birini tanlang"}</div>
            {fetchError && (
              <button className="btn btn-primary" onClick={() => fetchTrack(currentTrackSlug)}>
                🔄 Qayta yuklash
              </button>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          certificate={selectedCertForModal || existingCertForCurrentTrack}
          trackSlug={currentTrackSlug}
          trackTitle={trackData?.track?.title}
          userName={userName}
          onClose={() => setShowCertModal(false)}
          onClaim={handleClaimCertificate}
        />
      )}

      {/* Certificate Verification Modal */}
      {showVerifyModal && (
        <CertificateVerifyModal onClose={() => setShowVerifyModal(false)} />
      )}

      {/* Student Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          userName={userName}
          userPoints={totalUserPoints}
          passedTaskIds={passedTaskIds}
          certificates={certificates}
          onSaveName={handleSaveUserName}
          onViewCertificate={(cert) => {
            setSelectedCertForModal(cert);
            setShowProfileModal(false);
            setShowCertModal(true);
          }}
          onResetProgress={handleResetProgress}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminModal && (
        <AdminModal
          onClose={() => setShowAdminModal(false)}
          onRefreshTracks={() => fetchTrack(currentTrackSlug)}
        />
      )}
    </div>
  );
}
