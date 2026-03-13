export function PlatformsIllustration() {
  return (
    <svg
      viewBox="0 0 240 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Apple cube — left, white */}
      <g transform="translate(15, 30)">
        <polygon points="55,10 95,35 95,90 55,115 15,90 15,35" fill="#f5f4f0" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="55,10 95,35 55,60 15,35" fill="#eeece6" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="15,35 55,60 55,115 15,90" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="95,35 55,60 55,115 95,90" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Apple logo silhouette */}
        <g transform="translate(55, 62)" fill="#a0a09a">
          <path d="M0,-14 C4,-14 7,-11 7,-7 C11,-10 14,-7 14,-3 C14,4 10,9 5,11 C3,12 1,12 0,12 C-1,12 -3,12 -5,11 C-10,9 -14,4 -14,-3 C-14,-7 -11,-10 -7,-7 C-7,-11 -4,-14 0,-14Z" strokeWidth="0" />
          <ellipse cx="4" cy="-16" rx="3" ry="4" />
        </g>
      </g>

      {/* Windows cube — right-back, also neutral */}
      <g transform="translate(105, 15)">
        <polygon points="55,10 95,35 95,90 55,115 15,90 15,35" fill="#f0efe9" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="55,10 95,35 55,60 15,35" fill="#e8e6de" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="15,35 55,60 55,115 15,90" fill="#dddbd2" stroke="#c8c5bb" strokeWidth="1.5" />
        <polygon points="95,35 55,60 55,115 95,90" fill="#e4e2d9" stroke="#c8c5bb" strokeWidth="1.5" />
        {/* Windows logo */}
        <g transform="translate(55, 62)" fill="#a0a09a">
          <rect x="-13" y="-13" width="11" height="11" rx="1" />
          <rect x="2" y="-13" width="11" height="11" rx="1" />
          <rect x="-13" y="2" width="11" height="11" rx="1" />
          <rect x="2" y="2" width="11" height="11" rx="1" />
        </g>
      </g>

      {/* Linux penguin cube — front-right, highlighted yellow */}
      <g transform="translate(135, 50)">
        <polygon points="55,10 95,35 95,90 55,115 15,90 15,35" fill="#fdf3dc" stroke="#e8a020" strokeWidth="1.5" />
        <polygon points="55,10 95,35 55,60 15,35" fill="#fef8ec" stroke="#e8a020" strokeWidth="1.5" />
        <polygon points="15,35 55,60 55,115 15,90" fill="#f5e6c0" stroke="#e8a020" strokeWidth="1.5" />
        <polygon points="95,35 55,60 55,115 95,90" fill="#faeaca" stroke="#e8a020" strokeWidth="1.5" />
        {/* Tux/penguin silhouette simple */}
        <g transform="translate(55, 62)">
          {/* Body */}
          <ellipse cx="0" cy="4" rx="10" ry="13" fill="#3a3a38" />
          {/* Belly */}
          <ellipse cx="0" cy="6" rx="6" ry="9" fill="#f5f4f0" />
          {/* Head */}
          <circle cx="0" cy="-12" r="9" fill="#3a3a38" />
          {/* Eyes */}
          <circle cx="-3" cy="-13" r="2" fill="white" />
          <circle cx="3" cy="-13" r="2" fill="white" />
          <circle cx="-3" cy="-13" r="1" fill="#1a1a18" />
          <circle cx="3" cy="-13" r="1" fill="#1a1a18" />
          {/* Beak */}
          <ellipse cx="0" cy="-8" rx="4" ry="2.5" fill="#e8a020" />
        </g>
      </g>
    </svg>
  );
}
