import React from "react";

// Logo: bridge from a sound wave + eye
export const Bridge = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="sb-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#534AB7" />
        <stop offset="1" stopColor="#1D9E75" />
      </linearGradient>
    </defs>
    {/* bridge arch made from sound waves */}
    <path d="M4 32 Q24 6 44 32" stroke="url(#sb-g)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M10 32 Q24 14 38 32" stroke="#534AB7" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55"/>
    <path d="M16 32 Q24 22 32 32" stroke="#1D9E75" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
    {/* eye iris in center */}
    <circle cx="24" cy="32" r="4.5" fill="#534AB7"/>
    <circle cx="24" cy="32" r="1.6" fill="#FFFFFF"/>
    {/* deck */}
    <line x1="4" y1="38" x2="44" y2="38" stroke="#2C2C2A" strokeWidth="2" strokeLinecap="round" opacity="0.18"/>
  </svg>
);

export default Bridge;