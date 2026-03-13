export function EditorIllustration() {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Window frame */}
      <rect x="20" y="10" width="320" height="160" rx="8" fill="#fafaf8" stroke="#d4d2ca" strokeWidth="1.5" />

      {/* Title bar */}
      <rect x="20" y="10" width="320" height="36" rx="8" fill="#eeece6" />
      <rect x="20" y="34" width="320" height="12" fill="#eeece6" />

      {/* Traffic lights */}
      <circle cx="42" cy="28" r="5" fill="#d9d6ce" />
      <circle cx="58" cy="28" r="5" fill="#d9d6ce" />
      <circle cx="74" cy="28" r="5" fill="#d9d6ce" />

      {/* Tab: VS Code */}
      <rect x="95" y="16" width="90" height="24" rx="4" fill="#fafaf8" stroke="#d4d2ca" strokeWidth="1" />
      {/* VS Code logo icon */}
      <g transform="translate(103, 22)">
        <path d="M0 8 L5 0 L10 4 L6 8 L10 12 L5 16 L0 8Z" fill="none" stroke="#0078d4" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <text x="118" y="32" fontFamily="system-ui" fontSize="11" fill="#3a3a38" fontWeight="500">VS Code</text>

      {/* Tab: Zed */}
      <rect x="193" y="16" width="70" height="24" rx="4" fill="#fafaf8" stroke="#d4d2ca" strokeWidth="1" />
      <rect x="200" y="22" width="12" height="12" rx="2" fill="#12a37f" />
      <text x="217" y="32" fontFamily="system-ui" fontSize="11" fill="#3a3a38" fontWeight="500">Zed</text>

      {/* Code lines */}
      <rect x="36" y="58" width="140" height="8" rx="2" fill="#dddbd2" />
      <rect x="36" y="74" width="200" height="8" rx="2" fill="#e4e2d9" />
      <rect x="36" y="90" width="180" height="8" rx="2" fill="#e4e2d9" />
      <rect x="36" y="106" width="120" height="8" rx="2" fill="#dddbd2" />
      <rect x="36" y="122" width="220" height="8" rx="2" fill="#e4e2d9" />
      <rect x="36" y="138" width="160" height="8" rx="2" fill="#e4e2d9" />

      {/* Highlight line */}
      <rect x="36" y="74" width="200" height="8" rx="2" fill="#c7e0f4" opacity="0.6" />
    </svg>
  );
}
