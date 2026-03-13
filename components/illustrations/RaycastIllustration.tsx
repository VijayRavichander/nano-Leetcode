export function RaycastIllustration() {
  return (
    <svg
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Outer flat box */}
      <g transform="translate(30, 30)">
        {/* Box body */}
        <path d="M90 20 L160 55 L160 120 L90 155 L20 120 L20 55Z" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Box top */}
        <path d="M90 20 L160 55 L90 90 L20 55Z" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Box left */}
        <path d="M20 55 L90 90 L90 155 L20 120Z" fill="#dddbd2" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Box right */}
        <path d="M160 55 L90 90 L90 155 L160 120Z" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />

        {/* Inner lines on top */}
        <line x1="90" y1="20" x2="90" y2="90" stroke="#c8c5bb" strokeWidth="1" opacity="0.5" />
        <line x1="55" y1="37" x2="55" y2="73" stroke="#c8c5bb" strokeWidth="1" opacity="0.4" />
        <line x1="125" y1="37" x2="125" y2="73" stroke="#c8c5bb" strokeWidth="1" opacity="0.4" />

        {/* Horizontal lines suggesting stacked layers on the box face */}
        <line x1="20" y1="77" x2="160" y2="77" stroke="#c8c5bb" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="98" x2="160" y2="98" stroke="#c8c5bb" strokeWidth="1" opacity="0.5" />

        {/* Signal/arrow icon on top face */}
        <g transform="translate(90, 55)">
          <line x1="0" y1="-15" x2="0" y2="15" stroke="#6b6960" strokeWidth="2" strokeLinecap="round" />
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#6b6960" strokeWidth="2" strokeLinecap="round" />
          <path d="M-8 -8 L0 -16 L8 -8" fill="none" stroke="#6b6960" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
