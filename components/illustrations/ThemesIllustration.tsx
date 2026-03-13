export function ThemesIllustration() {
  return (
    <svg
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Stack of cards — dark card on bottom */}
      {/* Back-most card */}
      <g transform="translate(80, 20) rotate(-3)">
        <rect x="0" y="0" width="140" height="100" rx="8" fill="#e8e6de" stroke="#d4d2ca" strokeWidth="1.5" />
        <rect x="12" y="14" width="60" height="6" rx="2" fill="#d4d2ca" />
        <rect x="12" y="28" width="100" height="5" rx="2" fill="#dddbd2" />
        <rect x="12" y="40" width="80" height="5" rx="2" fill="#dddbd2" />
        <rect x="12" y="52" width="90" height="5" rx="2" fill="#dddbd2" />
      </g>

      {/* Middle card - dark */}
      <g transform="translate(60, 35) rotate(2)">
        <rect x="0" y="0" width="140" height="100" rx="8" fill="#2a2a26" stroke="#3a3a36" strokeWidth="1.5" />
        <rect x="12" y="14" width="60" height="6" rx="2" fill="#4a4a46" />
        <rect x="12" y="28" width="100" height="5" rx="2" fill="#3a3a36" />
        <rect x="12" y="40" width="80" height="5" rx="2" fill="#3a3a36" />
        <rect x="12" y="52" width="90" height="5" rx="2" fill="#3a3a36" />
        {/* Accent line */}
        <rect x="12" y="28" width="40" height="5" rx="2" fill="#12a37f" opacity="0.7" />
      </g>

      {/* Front card */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="150" height="105" rx="8" fill="#f5f4f0" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Dots row */}
        <circle cx="16" cy="16" r="5" fill="#e05d5d" />
        <circle cx="32" cy="16" r="5" fill="#e8a020" />
        <circle cx="48" cy="16" r="5" fill="#3ab06a" />
        {/* Code lines */}
        <rect x="12" y="30" width="70" height="5" rx="2" fill="#dddbd2" />
        <rect x="12" y="43" width="110" height="5" rx="2" fill="#e4e2d9" />
        <rect x="12" y="56" width="90" height="5" rx="2" fill="#e4e2d9" />
        <rect x="12" y="69" width="80" height="5" rx="2" fill="#dddbd2" />
        <rect x="12" y="82" width="100" height="5" rx="2" fill="#e4e2d9" />
      </g>
    </svg>
  );
}
