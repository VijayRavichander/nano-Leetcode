export function McpIllustration() {
  return (
    <svg
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Left cube */}
      <g transform="translate(30, 20)">
        <polygon points="50,10 90,30 90,80 50,100 10,80 10,30" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="50,10 90,30 50,50 10,30" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="10,30 50,50 50,100 10,80" fill="#dddbd2" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="90,30 50,50 50,100 90,80" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Claude-like asterisk accent */}
        <g transform="translate(50,55)" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round">
          <line x1="0" y1="-12" x2="0" y2="12" />
          <line x1="-10.4" y1="-6" x2="10.4" y2="6" />
          <line x1="-10.4" y1="6" x2="10.4" y2="-6" />
        </g>
      </g>

      {/* Middle cube */}
      <g transform="translate(120, 20)">
        <polygon points="50,10 90,30 90,80 50,100 10,80 10,30" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="50,10 90,30 50,50 10,30" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="10,30 50,50 50,100 10,80" fill="#dddbd2" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="90,30 50,50 50,100 90,80" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* ChatGPT-like circle accent */}
        <circle cx="50" cy="57" r="10" stroke="#6b6960" strokeWidth="1.5" fill="none" />
        <circle cx="50" cy="57" r="4" fill="#6b6960" />
      </g>

      {/* Right cube */}
      <g transform="translate(210, 20)">
        <polygon points="50,10 90,30 90,80 50,100 10,80 10,30" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="50,10 90,30 50,50 10,30" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="10,30 50,50 50,100 10,80" fill="#dddbd2" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="90,30 50,50 50,100 90,80" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Cursor/Zed like accent */}
        <g transform="translate(50,57)" stroke="#6b6960" strokeWidth="1.5">
          <line x1="-10" y1="-8" x2="10" y2="-8" />
          <line x1="-10" y1="0" x2="4" y2="0" />
          <line x1="-10" y1="8" x2="10" y2="8" />
        </g>
      </g>

      {/* Connecting lines between cubes */}
      <line x1="120" y1="80" x2="130" y2="80" stroke="#c8c5bb" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="210" y1="80" x2="220" y2="80" stroke="#c8c5bb" strokeWidth="1" strokeDasharray="3,3" />
    </svg>
  );
}
