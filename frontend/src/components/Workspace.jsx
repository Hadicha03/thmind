import React, { useState, useEffect, useRef } from "react";

// Lightweight Markdown Formatter
function FormattedContent({ content }) {
  if (!content) return null;

  // Split into lines
  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${idx}`} style={{ background: "var(--bg-card-secondary)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", overflowX: "auto", margin: "10px 0", fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--text-code)" }}>
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", margin: "14px 0 6px" }}>
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={idx} style={{ fontSize: "14px", fontWeight: "700", color: "var(--blue-500)", margin: "12px 0 4px" }}>
          {line.replace("#### ", "")}
        </h4>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <div key={idx} style={{ borderLeft: "3px solid var(--blue-500)", background: "var(--blue-light)", padding: "8px 12px", borderRadius: "0 6px 6px 0", margin: "8px 0", fontSize: "13px", color: "var(--text-primary)" }}>
          {line.replace("> ", "")}
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={idx} style={{ display: "flex", gap: "8px", margin: "4px 0 4px 8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
          <span style={{ color: "var(--blue-500)" }}>•</span>
          <span>{renderInline(line.substring(2))}</span>
        </div>
      );
    } else if (line.trim().length > 0) {
      elements.push(
        <p key={idx} style={{ margin: "6px 0", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {renderInline(line)}
        </p>
      );
    }
  });

  return <div>{elements}</div>;
}

// Inline formatting (bold, inline code)
function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{ fontFamily: "var(--font-mono)", background: "var(--bg-card-secondary)", padding: "2px 6px", borderRadius: "4px", fontSize: "12.5px", color: "var(--blue-500)", border: "1px solid var(--border-color)" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text-primary)" }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function Workspace({
  task,
  isPassed,
  onCheckCode,
  isChecking,
  lastResult,
  onAskAiHelp,
}) {
  // Left pane mode: 'theory' (Darslik / Tushuntirish) or 'task' (Amaliy Topshiriq)
  const [leftPaneMode, setLeftPaneMode] = useState("theory");

  // Load saved code from draft or starter code
  const [code, setCode] = useState(() => {
    if (!task?.id) return "";
    return localStorage.getItem(`thmind_draft_${task.id}`) || task.starter_code || "";
  });

  const [activeTab, setActiveTab] = useState("tests"); // 'tests', 'ai', 'preview', 'ask'
  const [question, setQuestion] = useState("");
  const [aiAnswers, setAiAnswers] = useState([]);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const textareaRef = useRef(null);

  const isQuiz = task?.language === "quiz";
  const quizQuestions = isQuiz && Array.isArray(task?.checker?.questions) ? task.checker.questions : [];
  const quizAnswers = (() => {
    if (!isQuiz) return [];
    try {
      const parsed = JSON.parse(code || "{}");
      return Array.isArray(parsed.answers) ? parsed.answers : [];
    } catch {
      return [];
    }
  })();
  const answeredCount = quizQuestions.filter((_, idx) => Number.isInteger(quizAnswers[idx])).length;

  const handleSelectAnswer = (questionIdx, optionIdx) => {
    const next = quizQuestions.map((_, idx) => (Number.isInteger(quizAnswers[idx]) ? quizAnswers[idx] : null));
    next[questionIdx] = optionIdx;
    handleCodeChange(JSON.stringify({ answers: next }));
  };

  // When task changes, update code and start on 'theory' mode (unless already passed)
  useEffect(() => {
    if (task?.id) {
      const draft = localStorage.getItem(`thmind_draft_${task.id}`);
      setCode(draft != null ? draft : task.starter_code || "");
      // Default to theory view so student reads explanation first
      setLeftPaneMode(isPassed ? "task" : "theory");
      if (lastResult?.passed === false) {
        setActiveTab("tests");
      }
    }
  }, [task?.id]);

  // Save draft to localStorage on change
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (task?.id) {
      localStorage.setItem(`thmind_draft_${task.id}`, newCode);
    }
  };

  // When lastResult arrives, switch tab appropriately
  useEffect(() => {
    if (lastResult) {
      if (lastResult.passed) {
        setActiveTab("ai");
      } else {
        setActiveTab("tests");
      }
    }
  }, [lastResult]);

  // Transition from Theory to Task & focus editor
  const handleProceedToTask = () => {
    setLeftPaneMode("task");
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      handleCodeChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
    // Ctrl + Enter or Cmd + Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  const handleRun = () => {
    if (isChecking) return;
    if (isQuiz && answeredCount < quizQuestions.length) {
      alert(`Iltimos, barcha savollarga javob belgilang (${answeredCount}/${quizQuestions.length}).`);
      return;
    }
    onCheckCode(code);
  };

  const handleReset = () => {
    if (window.confirm(isQuiz ? "Belgilangan javoblarni tozalamoqchimisiz?" : "Kodingizni boshlang'ich holatga qaytarmoqchimisiz?")) {
      handleCodeChange(task.starter_code || "");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Kod nusxalandi!");
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || isAskingAi) return;
    setIsAskingAi(true);
    try {
      const resp = await onAskAiHelp(code, question.trim());
      setAiAnswers((prev) => [
        ...prev,
        {
          q: question.trim(),
          a: resp?.ai_analysis || "AI javob tayyorlay olmadi.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setQuestion("");
    } catch (err) {
      alert("AI xatosi: " + err.message);
    } finally {
      setIsAskingAi(false);
    }
  };

  // Line count for gutter
  const lines = code.split("\n");
  const lineCount = Math.max(lines.length, 12);

  // Live preview HTML content
  const previewHtml =
    task?.language === "html"
      ? code
      : task?.language === "css"
      ? `<style>${code}</style>
         <div style="font-family: sans-serif; padding: 20px;">
           <div class="card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px;">
             <h3>Karta namunasi</h3>
             <p>CSS qoidalaringiz shu kartaga qo'llaniladi.</p>
           </div>
           <div class="row" style="margin-bottom: 15px;">
             <button class="btn">Tugma elementi</button>
           </div>
         </div>`
      : "";

  return (
    <div className="editor-main-area">
      {/* Instructions & Theory Column */}
      <div className="instructions-pane">
        {/* Header with Title and Tags */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="instructions-title">{task?.title}</h2>
          <div style={{ display: "flex", gap: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "var(--badge-blue-bg)",
                color: "var(--blue-500)",
              }}
            >
              {isQuiz ? "test" : task?.language}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "var(--badge-green-bg)",
                color: "var(--badge-green)",
              }}
            >
              +{task?.points} ball
            </span>
          </div>
        </div>

        {/* STEP TABS: 1. Darslik (Tushuntirish) vs 2. Topshiriq (Amaliyot) */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-card-secondary)",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            gap: "4px",
          }}
        >
          <button
            onClick={() => setLeftPaneMode("theory")}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: "6px",
              border: "none",
              background: leftPaneMode === "theory" ? "var(--blue-600)" : "transparent",
              color: leftPaneMode === "theory" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: "700",
              fontSize: "12.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <span>📖</span>
            <span>1. Darslik (Tushuntirish)</span>
          </button>

          <button
            onClick={() => setLeftPaneMode("task")}
            style={{
              flex: 1,
              padding: "7px 12px",
              borderRadius: "6px",
              border: "none",
              background: leftPaneMode === "task" ? "var(--red-600)" : "transparent",
              color: leftPaneMode === "task" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: "700",
              fontSize: "12.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <span>🎯</span>
            <span>2. Topshiriq (Vazifa)</span>
          </button>
        </div>

        {isPassed && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "var(--badge-green-bg)",
              color: "var(--badge-green)",
              fontSize: "13px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>✅</span>
            <span>Ushbu topshiriq muvaffaqiyatli topshirilgan!</span>
          </div>
        )}

        {/* MODE 1: THEORY / DARSLIK */}
        {leftPaneMode === "theory" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="instructions-body">
              <FormattedContent content={task?.theory || task?.instructions} />
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
              <button
                className="btn btn-primary glow-red-blue"
                onClick={handleProceedToTask}
                style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: "14px" }}
              >
                <span>🎯</span>
                <span>Tushundim, Topshiriqni Bajarishga O'tish ➡️</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: TASK / TOPSHIRIQ */}
        {leftPaneMode === "task" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Friendly flexible matching notice */}
            {!isQuiz && (
            <div
              style={{
                background: "var(--badge-blue-bg)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "12.5px",
                color: "var(--text-primary)",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "var(--blue-500)" }}>💡 Muhim qoida:</strong> Matn yoki mazmunni o'zingiz xohlagancha erkin yozishingiz mumkin! Asosiy maqsad — teglar va dastur mantig'ini to'g'ri yozishni o'rganish.
            </div>
            )}

            <div className="instructions-body">
              <FormattedContent content={task?.instructions} />
            </div>

            <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setLeftPaneMode("theory")}
                style={{ width: "100%", justifyContent: "center", fontSize: "12.5px" }}
              >
                <span>📖</span>
                <span>Darslikni (tushuntirishni) qayta o'qish</span>
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => setActiveTab("ask")}
                style={{ width: "100%", justifyContent: "center", fontSize: "12.5px" }}
              >
                <span>🤖</span>
                <span>AI Ustozdan maslahat olish</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor & Output Column */}
      <div className="editor-output-pane">
        {/* Editor Toolbar */}
        <div className="editor-toolbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {isQuiz ? "📝 Test savollari" : `${task?.language} Muharrir`}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {isQuiz ? `(Belgilangan: ${answeredCount}/${quizQuestions.length})` : "(Ctrl + Enter = Tekshirish)"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className="btn btn-ghost" onClick={handleReset} title="Kodni tozalash va tiklash" style={{ fontSize: "12px", padding: "4px 8px" }}>
              Tiklash
            </button>
            {!isQuiz && (
              <button className="btn btn-ghost" onClick={handleCopy} title="Nusxalash" style={{ fontSize: "12px", padding: "4px 8px" }}>
                Nusxa
              </button>
            )}
            <button
              className="btn btn-primary glow-red-blue"
              onClick={handleRun}
              disabled={isChecking}
              style={{ padding: "6px 18px", fontSize: "13px" }}
            >
              {isChecking ? (
                <span>⏳ AI Tekshirmoqda...</span>
              ) : (
                <>
                  <span>▶️</span>
                  <span>Tekshirish & AI Tahlil</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isQuiz ? (
          <div className="quiz-container">
            {quizQuestions.map((item, qIdx) => {
              const result = lastResult?.test_results?.[qIdx];
              const status = result ? (result.passed ? "correct" : "wrong") : "";
              return (
                <div key={qIdx} className={`quiz-question ${status}`}>
                  <div className="quiz-question-title">
                    {qIdx + 1}. {item.q} {result && <span>{result.passed ? "✅" : "❌"}</span>}
                  </div>
                  {item.options.map((option, oIdx) => (
                    <label key={oIdx} className={`quiz-option ${quizAnswers[qIdx] === oIdx ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name={`quiz-${task.id}-${qIdx}`}
                        checked={quizAnswers[qIdx] === oIdx}
                        onChange={() => handleSelectAnswer(qIdx, oIdx)}
                      />
                      <span>{String.fromCharCode(65 + oIdx)}) {option}</span>
                    </label>
                  ))}
                  {result && !result.passed && (
                    <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--badge-red)" }}>{result.message}</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
        <div className="editor-container">
          <div className="editor-line-numbers">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            placeholder="Kodingizni shu yerga yozing..."
          />
        </div>
        )}

        {/* Results / Bottom Tabs */}
        <div className="results-pane">
          <div className="results-tabs">
            <button
              className={`results-tab-btn ${activeTab === "tests" ? "active" : ""}`}
              onClick={() => setActiveTab("tests")}
            >
              <span>🧪</span>
              <span>Test Natijalari</span>
              {lastResult && (
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: lastResult.passed ? "var(--badge-green-bg)" : "var(--badge-red-bg)",
                    color: lastResult.passed ? "var(--badge-green)" : "var(--badge-red)",
                  }}
                >
                  {lastResult.passed ? "Muvaffaqiyatli" : "Xatolar bor"}
                </span>
              )}
            </button>

            <button
              className={`results-tab-btn ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <span>🤖</span>
              <span>AI Ustoz Tahlili</span>
              {lastResult?.ai_analysis && <span style={{ color: "var(--blue-500)" }}>•</span>}
            </button>

            {(task?.language === "html" || task?.language === "css") && (
              <button
                className={`results-tab-btn ${activeTab === "preview" ? "active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                <span>🌐</span>
                <span>Jonli Natija (Live Preview)</span>
              </button>
            )}

            <button
              className={`results-tab-btn ${activeTab === "ask" ? "active" : ""}`}
              onClick={() => setActiveTab("ask")}
            >
              <span>💬</span>
              <span>AI Savol-Javob</span>
              {aiAnswers.length > 0 && <span>({aiAnswers.length})</span>}
            </button>
          </div>

          <div className="results-content">
            {/* TAB 1: Tests */}
            {activeTab === "tests" && (
              <div>
                {!lastResult ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px 0" }}>
                    {isQuiz ? "Savollarga javob belgilang" : "Kodni yozing"} va yuqoridagi <strong>"Tekshirish & AI Tahlil"</strong> tugmasini bosing.
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: lastResult.passed ? "var(--badge-green)" : "var(--badge-red)" }}>
                        {lastResult.passed ? "🎉 Barcha tekshiruvlar to'g'ri bajarildi!" : "⚠️ Ayrim testlar o'tmadi"}
                      </span>
                      {lastResult.score && (
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                          Natija: {lastResult.score.correct}/{lastResult.score.total} ({lastResult.score.percent}%)
                        </span>
                      )}
                    </div>

                    {lastResult.test_results?.map((t, idx) => (
                      <div key={idx} className={`test-row ${t.passed ? "passed" : "failed"}`}>
                        <span style={{ fontSize: "16px" }}>{t.passed ? "✅" : "❌"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{t.name}</div>
                          <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{t.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI Feedback */}
            {activeTab === "ai" && (
              <div>
                {!lastResult?.ai_analysis ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "10px 0" }}>
                    AI tahlili kodni tekshirganingizdan keyin shu yerda ko'rinadi.
                  </div>
                ) : (
                  <div className="ai-panel">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px" }}>
                      <span style={{ fontWeight: "700", color: "var(--blue-500)", fontSize: "12px" }}>
                        ✨ TH Mind AI Ustoz Tahlili ({lastResult.ai_source === "gemini" ? "Google Gemini AI" : "Lokal AI Ustoz"})
                      </span>
                      {lastResult.points_earned > 0 && (
                        <span style={{ fontWeight: "700", color: "var(--badge-green)", fontSize: "12px" }}>
                          +{lastResult.points_earned} ball olindi!
                        </span>
                      )}
                    </div>
                    {lastResult.ai_warning && (
                      <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706", padding: "6px 10px", borderRadius: "6px", marginBottom: "8px", fontSize: "12px" }}>
                        ⚠️ {lastResult.ai_warning}
                      </div>
                    )}
                    <div>{lastResult.ai_analysis}</div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Live Preview */}
            {activeTab === "preview" && (
              <div style={{ height: "100%", minHeight: "180px" }}>
                <iframe
                  className="live-preview-frame"
                  srcDoc={previewHtml}
                  title="Live Preview"
                  sandbox="allow-scripts"
                />
              </div>
            )}

            {/* TAB 4: Ask AI Question */}
            {activeTab === "ask" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <form onSubmit={handleAskQuestion} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="AI dan so'rang: Masalan, 'Qayerdan boshlasam bo'ladi?' yoki 'Nega xato beryapti?'"
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: "8px",
                      background: "var(--bg-card-secondary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={isAskingAi || !question.trim()}>
                    {isAskingAi ? "O'ylanmoqda..." : "Yuborish"}
                  </button>
                </form>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {aiAnswers.length === 0 && (
                    <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      Topshiriq yuzasidan istalgan savolingizni bering. AI ustoz sizga tushuntirib beradi.
                    </div>
                  )}
                  {aiAnswers.map((item, idx) => (
                    <div key={idx} style={{ background: "var(--bg-card-secondary)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--blue-500)", fontWeight: "700", marginBottom: "4px" }}>
                        <span>Sizning savolingiz: "{item.q}"</span>
                        <span style={{ color: "var(--text-muted)" }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-primary)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
