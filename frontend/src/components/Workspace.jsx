import React, { useState, useEffect, useRef } from "react";

// Lightweight Markdown Formatter
function FormattedContent({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  lines.forEach((line, idx) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${idx}`} className="md-pre">
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
      elements.push(<h3 key={idx} className="md-h3">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("#### ")) {
      elements.push(<h4 key={idx} className="md-h4">{renderInline(line.slice(5))}</h4>);
    } else if (line.startsWith("> ")) {
      elements.push(<div key={idx} className="md-quote">{renderInline(line.slice(2))}</div>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={idx} className="md-li">
          <span className="md-bullet">•</span>
          <span>{renderInline(line.substring(2))}</span>
        </div>
      );
    } else if (line.trim().length > 0) {
      elements.push(<p key={idx} className="md-p">{renderInline(line)}</p>);
    }
  });

  return <div className="md">{elements}</div>;
}

// Inline formatting (bold, inline code)
function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return <code key={i} className="md-code">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
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
  const gutterRef = useRef(null);

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
        <div className="lesson-head">
          <h2 className="instructions-title">{task?.title}</h2>
          <div className="lesson-tags">
            <span className={`lang-tag lang-${task?.language}`}>{isQuiz ? "test" : task?.language}</span>
            <span className="chip chip-green">+{task?.points} ball</span>
          </div>
        </div>

        <div className="segmented">
          <button className={leftPaneMode === "theory" ? "active" : ""} onClick={() => setLeftPaneMode("theory")}>
            📖 1. Darslik
          </button>
          <button className={leftPaneMode === "task" ? "active" : ""} onClick={() => setLeftPaneMode("task")}>
            🎯 2. Topshiriq
          </button>
        </div>

        {isPassed && <div className="alert alert-success">✅ Ushbu dars muvaffaqiyatli topshirilgan!</div>}

        {leftPaneMode === "theory" && (
          <>
            <div className="instructions-body">
              <FormattedContent content={task?.theory || task?.instructions} />
            </div>
            <div className="pane-actions">
              <button className="btn btn-primary btn-block" onClick={handleProceedToTask}>
                Tushundim, topshiriqqa o'tish →
              </button>
            </div>
          </>
        )}

        {leftPaneMode === "task" && (
          <>
            {!isQuiz && (
              <div className="alert alert-info">
                <strong>💡 Muhim qoida:</strong> Matnni o'zingiz xohlagancha yozishingiz mumkin. Asosiy maqsad — teglar va dastur mantig'ini to'g'ri yozish.
              </div>
            )}
            <div className="instructions-body">
              <FormattedContent content={task?.instructions} />
            </div>
            <div className="pane-actions">
              <button className="btn btn-secondary btn-block" onClick={() => setLeftPaneMode("theory")}>
                📖 Darslikni qayta o'qish
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setActiveTab("ask")}>
                🤖 AI Ustozdan maslahat olish
              </button>
            </div>
          </>
        )}
      </div>

      {/* Editor & Output Column */}
      <div className="editor-output-pane">
        <div className="editor-toolbar">
          <div className="toolbar-title">
            <span className="toolbar-label">{isQuiz ? "📝 Test savollari" : `${task?.language} muharrir`}</span>
            <span className="toolbar-hint">
              {isQuiz ? `Belgilangan: ${answeredCount}/${quizQuestions.length}` : "Ctrl + Enter = Tekshirish"}
            </span>
          </div>

          <div className="toolbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleReset} title={isQuiz ? "Javoblarni tozalash" : "Kodni boshlang'ich holatga qaytarish"}>
              ↺ Tozalash
            </button>
            {!isQuiz && (
              <button className="btn btn-ghost btn-sm" onClick={handleCopy} title="Kodni nusxalash">
                ⧉ Nusxa
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={handleRun} disabled={isChecking}>
              {isChecking ? "⏳ Tekshirilmoqda..." : "▶ Tekshirish"}
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
                  {result && !result.passed && <div className="quiz-hint">{result.message}</div>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="editor-container">
            <div className="editor-line-numbers" ref={gutterRef}>
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
              onScroll={(e) => {
                if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
              }}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="Kodingizni shu yerga yozing..."
            />
          </div>
        )}

        <div className="results-pane">
          <div className="results-tabs" role="tablist">
            <button className={`results-tab-btn ${activeTab === "tests" ? "active" : ""}`} onClick={() => setActiveTab("tests")}>
              🧪 Natijalar
              {lastResult && (
                <span className={`chip ${lastResult.passed ? "chip-green" : "chip-red"}`}>
                  {lastResult.score ? `${lastResult.score.correct}/${lastResult.score.total}` : lastResult.passed ? "✓" : "✗"}
                </span>
              )}
            </button>
            <button className={`results-tab-btn ${activeTab === "ai" ? "active" : ""}`} onClick={() => setActiveTab("ai")}>
              🤖 AI Ustoz
              {lastResult?.ai_analysis && <span className="dot" />}
            </button>
            {(task?.language === "html" || task?.language === "css") && (
              <button className={`results-tab-btn ${activeTab === "preview" ? "active" : ""}`} onClick={() => setActiveTab("preview")}>
                🌐 Jonli natija
              </button>
            )}
            <button className={`results-tab-btn ${activeTab === "ask" ? "active" : ""}`} onClick={() => setActiveTab("ask")}>
              💬 Savol berish
              {aiAnswers.length > 0 && <span className="chip">{aiAnswers.length}</span>}
            </button>
          </div>

          <div className="results-content">
            {activeTab === "tests" && (
              !lastResult ? (
                <div className="result-empty">
                  {isQuiz ? "Savollarga javob belgilang" : "Kodni yozing"} va <strong>"▶ Tekshirish"</strong> tugmasini bosing.
                </div>
              ) : (
                <>
                  <div className={`result-summary ${lastResult.passed ? "ok" : "fail"}`}>
                    <span>{lastResult.passed ? "🎉 Barcha tekshiruvlar to'g'ri bajarildi!" : "⚠️ Ayrim tekshiruvlar o'tmadi"}</span>
                    {lastResult.score && (
                      <span className="result-score">
                        {lastResult.score.correct}/{lastResult.score.total} · {lastResult.score.percent}%
                      </span>
                    )}
                  </div>
                  {lastResult.test_results?.map((t, idx) => (
                    <div key={idx} className={`test-row ${t.passed ? "passed" : "failed"}`}>
                      <span className="test-icon">{t.passed ? "✅" : "❌"}</span>
                      <div className="test-body">
                        <div className="test-name">{t.name}</div>
                        <div className="test-msg">{t.message}</div>
                      </div>
                    </div>
                  ))}
                </>
              )
            )}

            {activeTab === "ai" && (
              !lastResult?.ai_analysis ? (
                <div className="result-empty">AI tahlili tekshiruvdan keyin shu yerda ko'rinadi.</div>
              ) : (
                <div className="ai-panel">
                  <div className="ai-panel-head">
                    <span>✨ AI Ustoz tahlili · {lastResult.ai_source === "gemini" ? "Google Gemini" : "Lokal AI"}</span>
                    {lastResult.points_earned > 0 && <span className="chip chip-green">+{lastResult.points_earned} ball</span>}
                  </div>
                  {lastResult.ai_warning && <div className="alert alert-warn">⚠️ {lastResult.ai_warning}</div>}
                  <div className="ai-panel-body">{lastResult.ai_analysis}</div>
                </div>
              )
            )}

            {activeTab === "preview" && (
              <iframe className="live-preview-frame" srcDoc={previewHtml} title="Jonli natija" sandbox="allow-scripts" />
            )}

            {activeTab === "ask" && (
              <div className="ask-panel">
                <form onSubmit={handleAskQuestion} className="inline-form">
                  <input
                    className="input"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Masalan: Qayerdan boshlasam bo'ladi?"
                  />
                  <button type="submit" className="btn btn-primary" disabled={isAskingAi || !question.trim()}>
                    {isAskingAi ? "..." : "Yuborish"}
                  </button>
                </form>
                {aiAnswers.length === 0 && (
                  <div className="result-empty">Dars yuzasidan istalgan savolingizni bering — AI ustoz tushuntirib beradi.</div>
                )}
                {aiAnswers.map((item, idx) => (
                  <div key={idx} className="ask-item">
                    <div className="ask-item-head">
                      <span>Savol: "{item.q}"</span>
                      <span className="text-muted">{item.time}</span>
                    </div>
                    <div className="ask-item-body">{item.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
