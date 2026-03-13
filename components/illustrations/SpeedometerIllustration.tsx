export function SpeedometerIllustration() {
  return (
    <svg
      viewBox="0 0 280 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Gauge arc — outer */}
      <path
        d="M 50 140 A 90 90 0 0 1 230 140"
        stroke="#d4d2ca"
        strokeWidth="2"
        fill="none"
      />
      {/* Gauge arc — inner */}
      <path
        d="M 65 140 A 75 75 0 0 1 215 140"
        stroke="#e4e2d9"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Tick marks */}
      {[...Array(9)].map((_, i) => {
        const angle = -180 + i * 22.5;
        const rad = (angle * Math.PI) / 180;
        const cx = 140, cy = 140, r1 = 78, r2 = 90;
        const x1 = cx + r1 * Math.cos(rad);
        const y1 = cy + r1 * Math.sin(rad);
        const x2 = cx + r2 * Math.cos(rad);
        const y2 = cy + r2 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#c8c5bb"
            strokeWidth={i === 0 || i === 4 || i === 8 ? 2 : 1}
          />
        );
      })}

      {/* Needle — pointing fast (right side) */}
      <g transform="translate(140, 140) rotate(-30)">
        <line x1="0" y1="0" x2="0" y2="-72" stroke="#3a3a38" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="14" stroke="#3a3a38" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Center hub */}
      <circle cx="140" cy="140" r="10" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="2" />
      <circle cx="140" cy="140" r="4" fill="#3a3a38" />

      {/* Hatching on the outer arc region */}
      <defs>
        <clipPath id="gaugeClip">
          <path d="M 30 145 A 110 110 0 0 1 250 145 L 230 145 A 90 90 0 0 0 50 145 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#gaugeClip)" opacity="0.35">
        {[...Array(14)].map((_, i) => (
          <line
            key={i}
            x1={30 + i * 16} y1={100}
            x2={20 + i * 16} y2={150}
            stroke="#c8c5bb"
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}
