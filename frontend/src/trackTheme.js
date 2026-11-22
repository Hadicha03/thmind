const THEMES = {
  frontend: { icon: "🎨", label: "Frontend Darslari", color: "var(--red-500)", light: "var(--red-light)" },
  backend: { icon: "⚙️", label: "Backend Darslari", color: "var(--blue-500)", light: "var(--blue-light)" },
  savodxonlik: { icon: "💻", label: "Savodxonlik Darslari", color: "var(--green-500)", light: "var(--green-light)" },
};

export function getTrackTheme(slug) {
  return { slug: THEMES[slug] ? slug : "backend", ...(THEMES[slug] || THEMES.backend) };
}
