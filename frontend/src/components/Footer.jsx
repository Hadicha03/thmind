import React from "react";
import Logo from "./Logo.jsx";
import { ADMIN_CONTACT, phoneUrl, telegramUrl } from "../contact.js";

export default function Footer({ tracks = [], onOpenVerify, onAuth, onOpenTrack }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size="md" />
          <p>
            THMind — o'zbek tilidagi amaliy ta'lim platformasi. Darslik, topshiriq, avtomatik tekshiruv va AI ustoz bitta
            joyda.
          </p>
        </div>

        <div className="footer-col">
          <h4>Kurslar</h4>
          {tracks.map((t) => (
            <button key={t.slug} className="footer-link" onClick={() => (onOpenTrack ? onOpenTrack(t.slug) : onAuth?.("register"))}>
              {t.title}
            </button>
          ))}
        </div>

        <div className="footer-col">
          <h4>Platforma</h4>
          {onAuth && (
            <>
              <button className="footer-link" onClick={() => onAuth("login")}>Kirish</button>
              <button className="footer-link" onClick={() => onAuth("register")}>Ro'yxatdan o'tish</button>
            </>
          )}
          <button className="footer-link" onClick={onOpenVerify}>Sertifikatni tekshirish</button>
        </div>

        <div className="footer-col">
          <h4>Bog'lanish</h4>
          <a className="footer-link" href={telegramUrl} target="_blank" rel="noopener noreferrer">✈️ @{ADMIN_CONTACT.telegram}</a>
          <a className="footer-link" href={phoneUrl}>📞 {ADMIN_CONTACT.phoneLabel}</a>
        </div>
      </div>
      <div className="footer-bottom">© {year} THMind. Barcha huquqlar himoyalangan.</div>
    </footer>
  );
}
