import React from "react";

export default function Logo({ size = "md" }) {
  return <img src="/logo-full.png" alt="THMind" className={`logo-img logo-${size}`} draggable="false" />;
}
