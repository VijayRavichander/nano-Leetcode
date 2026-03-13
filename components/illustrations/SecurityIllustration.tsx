export function SecurityIllustration() {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Crosshair/target lines - light dashed */}
      <line x1="120" y1="0" x2="120" y2="160" stroke="#d4d2ca" strokeWidth="1" strokeDasharray="4,4" />
      <line x1="0" y1="80" x2="240" y2="80" stroke="#d4d2ca" strokeWidth="1" strokeDasharray="4,4" />

      {/* Corner brackets */}
      <path d="M 40 30 L 20 30 L 20 50" stroke="#c8c5bb" strokeWidth="1.5" fill="none" />
      <path d="M 200 30 L 220 30 L 220 50" stroke="#c8c5bb" strokeWidth="1.5" fill="none" />
      <path d="M 40 130 L 20 130 L 20 110" stroke="#c8c5bb" strokeWidth="1.5" fill="none" />
      <path d="M 200 130 L 220 130 L 220 110" stroke="#c8c5bb" strokeWidth="1.5" fill="none" />

      {/* Confirm button — blue pill with shadow */}
      <g transform="translate(80, 52) rotate(-12)">
        <rect x="0" y="0" width="96" height="34" rx="6" fill="#2563eb" />
        <text x="48" y="22" fontFamily="system-ui" fontSize="13" fill="white" fontWeight="600" textAnchor="middle">Confirm</text>
      </g>

      {/* Small cursor indicator */}
      <g transform="translate(148, 98)">
        <path d="M0 0 L0 18 L5 13 L8 20 L10 19 L7 12 L13 12Z" fill="#3a3a38" />
      </g>

      {/* Small tick mark */}
      <g transform="translate(58, 105)">
        <line x1="0" y1="8" x2="5" y2="14" stroke="#3a3a38" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="14" x2="14" y2="2" stroke="#3a3a38" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
