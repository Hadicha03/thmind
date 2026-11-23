import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { getTrackTheme } from "../trackTheme.js";
import Logo from "./Logo.jsx";
import Footer from "./Footer.jsx";

const FEATURES = [
  { icon: "📖", title: "O'zbek tilida darsliklar", text: "Har bir mavzu sodda tilda, misollar va kod namunalari bilan tushuntiriladi." },
  { icon: "💻", title: "Brauzerda amaliyot", text: "Hech narsa o'rnatmasdan kod yozasiz va natijani shu zahoti ko'rasiz." },
  { icon: "✅", title: "Avtomatik tekshiruv", text: "Topshiriq va testlar darhol tekshiriladi, xato joyi aniq ko'rsatiladi." },
  { icon: "🤖", title: "AI Ustoz", text: "Kodingizni tahlil qiladi, maslahat beradi va savollaringizga javob beradi." },
  { icon: "📊", title: "Progress va ballar", text: "Har bir bajarilgan dars uchun ball olasiz, natijangizni profilda kuzatasiz." },
  { icon: "🎓", title: "Sertifikat", text: "Kursni tugatganingizda tekshirish ID raqamli sertifikat beriladi." },
];

const STEPS = [
  { title: "Ro'yxatdan o'ting", text: "Email va parol bilan bepul hisob yarating." },
  { title: "Kursni tanlang", text: "Frontend, Backend yoki Kompyuter savodxonligi." },
  { title: "O'qing va bajaring", text: "Darslikni o'qing, topshiriqni bajaring, tekshiring." },
  { title: "Sertifikat oling", text: "Barcha darslarni topshiring va sertifikatni yuklab oling." },
];

export default function Landing({ theme, onToggleTheme, onAuth, onOpenVerify }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    api("/api/tracks").then(setTracks).catch(() => setTracks([]));
  }, []);

  const totalLessons = tracks.reduce((s, t) => s + (t.tasks_count || 0), 0);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="landing">
      <header className="app-header landing-nav">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Bosh sahifa">
          <Logo />
        </button>
        <nav className="landing-links">
          <button onClick={() => scrollTo("kurslar")}>Kurslar</button>
          <button onClick={() => scrollTo("imkoniyatlar")}>Imkoniyatlar</button>
          <button onClick={() => scrollTo("qanday")}>Qanday ishlaydi</button>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={onToggleTheme} title="Rejimni almashtirish">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onAuth("login")}>Kirish</button>
          <button className="btn btn-primary btn-sm hide-sm" onClick={() => onAuth("register")}>Ro'yxatdan o'tish</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-text">
          <span className="hero-badge">🇺🇿 O'zbek tilidagi amaliy ta'lim platformasi</span>
          <h1>
            Dasturlash va kompyuter savodxonligini <span className="grad">amalda</span> o'rganing
          </h1>
          <p>
            THMind — darslik, amaliy topshiriq, avtomatik tekshiruv va AI ustoz bitta joyda. Kurslarni o'z tezligingizda
            o'ting, ball to'plang va sertifikat oling.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onAuth("register")}>Bepul boshlash →</button>
            <button className="btn btn-secondary btn-lg" onClick={() => scrollTo("kurslar")}>Kurslarni ko'rish</button>
          </div>
          <div className="hero-stats">
            <div><strong>{tracks.length || 3}</strong><span>kurs</span></div>
            <div><strong>{totalLessons || "40+"}</strong><span>dars</span></div>
            <div><strong>24/7</strong><span>AI ustoz</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="mock-window">
            <div className="mock-bar"><i /><i /><i /><span>index.html</span></div>
            <pre className="mock-code">{`<h1>Salom, THMind!</h1>
<p>Men dasturlashni
   o'rganyapman 🚀</p>`}</pre>
            <div className="mock-result ok">✅ Barcha tekshiruvlar to'g'ri bajarildi!</div>
            <div className="mock-ai">🤖 <strong>AI Ustoz:</strong> Ajoyib! Endi sarlavhaga rang berib ko'ring.</div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="biz">
        <div className="about-card card">
          <h2>Biz kimmiz?</h2>
          <p>
            THMind — boshlang'ich o'quvchilar uchun yaratilgan onlayn o'quv platformasi. Bizning maqsadimiz — kompyuterdan
            foydalanishni va dasturlashni o'zbek tilida, tushunarli va amaliy tarzda o'rgatish. Har bir dars nazariya,
            amaliy topshiriq va tekshiruvdan iborat, shuning uchun bilim darhol ko'nikmaga aylanadi.
          </p>
        </div>
      </section>

      <section className="landing-section" id="kurslar">
        <div className="section-head">
          <h2>Kurslarimiz</h2>
          <p>Darajangizga mos yo'nalishni tanlang</p>
        </div>
        <div className="course-grid">
          {tracks.map((track) => {
            const t = getTrackTheme(track.slug);
            return (
              <button key={track.slug} className={`card course-card course-${t.slug}`} onClick={() => onAuth("register")}>
                <div className="course-card-top">
                  <span className={`track-icon-box track-icon-${t.slug}`}>{t.icon}</span>
                  <span className="chip">{track.level || "Boshlang'ich"}</span>
                </div>
                <div className="course-title">{track.title}</div>
                <div className="course-summary">{track.summary}</div>
                <div className="course-meta">
                  <span>📚 {track.tasks_count} dars</span>
                  <span>⭐ {track.total_points} ball</span>
                </div>
                <span className="course-cta">Boshlash →</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="landing-section" id="imkoniyatlar">
        <div className="section-head">
          <h2>Nimalarni taklif qilamiz?</h2>
          <p>O'rganish uchun kerak bo'lgan hamma narsa bitta platformada</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="card feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section" id="qanday">
        <div className="section-head">
          <h2>Qanday ishlaydi?</h2>
          <p>4 ta oddiy qadam</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card step-card">
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="cta-band">
          <h2>Bugunoq o'rganishni boshlang</h2>
          <p>Ro'yxatdan o'tish bepul va bir daqiqa vaqt oladi.</p>
          <button className="btn btn-lg cta-btn" onClick={() => onAuth("register")}>Hisob yaratish →</button>
        </div>
      </section>

      <Footer tracks={tracks} onAuth={onAuth} onOpenVerify={onOpenVerify} />
    </div>
  );
}
