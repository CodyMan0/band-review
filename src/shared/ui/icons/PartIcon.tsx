import { type Part } from '@/shared/config/parts';

interface PartIconProps {
  part: Part;
  className?: string;
  size?: number;
}

export function PartIcon({ part, className, size = 14 }: PartIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 14 14',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
  };

  switch (part) {
    // ── Microphone (stick mic with round head) ──────────────────────────────
    case 'vocal':
      return (
        <svg {...props}>
          {/* Mic head */}
          <ellipse cx="7" cy="4.5" rx="2.5" ry="3" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.15" />
          {/* Mic body / stand */}
          <line x1="7" y1="7.5" x2="7" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {/* Mic stand base */}
          <path d="M4.5 11 Q7 13 9.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          {/* Stand arc */}
          <path d="M5 6.5 Q4 9.5 7 9.5 Q10 9.5 9 6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      );

    // ── Acoustic guitar silhouette ──────────────────────────────────────────
    case 'guitar':
      return (
        <svg {...props}>
          {/* Neck */}
          <rect x="6.2" y="0.8" width="1.6" height="6" rx="0.8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.8" />
          {/* Nut */}
          <rect x="5.8" y="0.5" width="2.4" height="0.9" rx="0.4" fill="currentColor" />
          {/* Body lower bout */}
          <ellipse cx="7" cy="10.5" rx="3.2" ry="2.8" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.1" />
          {/* Body upper bout */}
          <ellipse cx="7" cy="7.8" rx="2.4" ry="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.1" />
          {/* Sound hole */}
          <circle cx="7" cy="9.8" r="0.9" fill="currentColor" fillOpacity="0.4" />
        </svg>
      );

    // ── Bass guitar (longer neck, slimmer body) ─────────────────────────────
    case 'bass':
      return (
        <svg {...props}>
          {/* Neck — longer than guitar */}
          <rect x="6.3" y="0.4" width="1.4" height="7.5" rx="0.7" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.8" />
          {/* Nut */}
          <rect x="5.9" y="0.2" width="2.2" height="0.8" rx="0.4" fill="currentColor" />
          {/* Body — offset, asymmetric */}
          <path
            d="M4 8.5 C3 8.5, 2.5 9.5, 3 10.8 C3.4 11.8, 5 12.8, 7 12.8 C9 12.8, 10.5 12, 10.8 10.8 C11.2 9.5, 10.5 8.5, 9.5 8.2 L7.7 7.8 L6.3 7.8 Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          {/* Pickup */}
          <rect x="5.5" y="9.5" width="3" height="1.2" rx="0.4" fill="currentColor" fillOpacity="0.5" />
        </svg>
      );

    // ── Drum sticks crossed ─────────────────────────────────────────────────
    case 'drum':
      return (
        <svg {...props}>
          {/* Left stick */}
          <line x1="2" y1="12" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left tip bead */}
          <circle cx="10.2" cy="1.8" r="1.2" fill="currentColor" />
          {/* Right stick */}
          <line x1="12" y1="12" x2="4" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right tip bead */}
          <circle cx="3.8" cy="1.8" r="1.2" fill="currentColor" />
          {/* Drum body suggestion at the bottom */}
          <path d="M1.5 11.5 Q7 13.5 12.5 11.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
      );

    // ── Piano keys (4 white + 3 black) ─────────────────────────────────────
    case 'keyboard':
      return (
        <svg {...props}>
          {/* Outer border */}
          <rect x="1" y="3.5" width="12" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" fill="currentColor" fillOpacity="0.08" />
          {/* White key dividers */}
          <line x1="4" y1="3.5" x2="4" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="7" y1="3.5" x2="7" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="10" y1="3.5" x2="10" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          {/* Black keys */}
          <rect x="2.5" y="3.5" width="2" height="5" rx="0.5" fill="currentColor" fillOpacity="0.8" />
          <rect x="5.5" y="3.5" width="2" height="5" rx="0.5" fill="currentColor" fillOpacity="0.8" />
          <rect x="8.5" y="3.5" width="2" height="5" rx="0.5" fill="currentColor" fillOpacity="0.8" />
        </svg>
      );

    // ── Music note (eighth note) ────────────────────────────────────────────
    case 'etc':
    default:
      return (
        <svg {...props}>
          {/* Note head */}
          <ellipse cx="4.5" cy="11" rx="2.5" ry="1.8" transform="rotate(-15 4.5 11)" fill="currentColor" />
          {/* Note stem */}
          <line x1="6.8" y1="10.2" x2="6.8" y2="2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {/* Flag */}
          <path d="M6.8 2.5 Q10 4.5 9 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}
