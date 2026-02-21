interface IllustrationProps {
  className?: string;
  size?: number;
}

// ─── CarrotLogo ──────────────────────────────────────────────────────────────
// Small inline branding carrot — no face, pure silhouette
export function CarrotLogo({ className, size = 20 }: IllustrationProps) {
  const w = size * 0.8;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaves */}
      <ellipse cx="6.5" cy="4" rx="2.5" ry="5.5" transform="rotate(-18 6.5 4)" fill="#4CAF50" />
      <ellipse cx="8" cy="3" rx="2.2" ry="6" fill="#66BB6A" />
      <ellipse cx="9.5" cy="4" rx="2.5" ry="5.5" transform="rotate(18 9.5 4)" fill="#4CAF50" />
      {/* Body */}
      <path d="M4 7.5 C4 7.5, 2.5 13.5, 8 19 C13.5 13.5, 12 7.5, 12 7.5 Z" fill="#FF8A00" />
      <path d="M6 7.5 C6 7.5, 5 13, 8 18 C11 13, 10 7.5, 10 7.5 Z" fill="#FFA040" opacity="0.55" />
      {/* Top cap */}
      <ellipse cx="8" cy="7.5" rx="4.2" ry="1.6" fill="#FF8A00" />
    </svg>
  );
}

// ─── CarrotWave ───────────────────────────────────────────────────────────────
// Carrot waving one leaf-hand. Cute face, 32×32 default.
export function CarrotWave({ className, size = 32 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left leaf (normal) */}
      <ellipse cx="11" cy="8" rx="3" ry="7" transform="rotate(-20 11 8)" fill="#4CAF50" />
      {/* Center leaf */}
      <ellipse cx="14" cy="6.5" rx="2.8" ry="7.5" fill="#66BB6A" />
      {/* Right leaf — raised/waving */}
      <ellipse cx="21" cy="4" rx="2.8" ry="7" transform="rotate(45 21 4)" fill="#4CAF50" />
      {/* Waving motion arc */}
      <path
        d="M21 4 Q25 1 26 5"
        stroke="#4CAF50"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Body */}
      <path d="M8 13 C8 13, 6 22, 16 30 C26 22, 24 13, 24 13 Z" fill="#FF8A00" />
      <path d="M11 13 C11 13, 9.5 21, 16 28 C22.5 21, 21 13, 21 13 Z" fill="#FFA040" opacity="0.55" />
      {/* Top cap */}
      <ellipse cx="16" cy="13" rx="8.5" ry="2.8" fill="#FF8A00" />
      {/* Eyes */}
      <circle cx="13" cy="18.5" r="1.2" fill="#D35400" />
      <circle cx="19" cy="18.5" r="1.2" fill="#D35400" />
      {/* Smile */}
      <path d="M14 21.5 Q16 23.5 18 21.5" stroke="#D35400" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <circle cx="11" cy="21" r="1.5" fill="#FFB74D" opacity="0.45" />
      <circle cx="21" cy="21" r="1.5" fill="#FFB74D" opacity="0.45" />
    </svg>
  );
}

// ─── CarrotClap ───────────────────────────────────────────────────────────────
// Compact inline carrot with impact/motion lines. 20×20 default.
export function CarrotClap({ className, size = 20 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Impact burst lines */}
      <line x1="2" y1="5" x2="4.5" y2="7" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1" y1="10" x2="3.5" y2="10" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="2.5" y1="15" x2="5" y2="13" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="5" x2="15.5" y2="7" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="19" y1="10" x2="16.5" y2="10" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17.5" y1="15" x2="15" y2="13" stroke="#FFB74D" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaves */}
      <ellipse cx="7.5" cy="4.5" rx="1.8" ry="4" transform="rotate(-18 7.5 4.5)" fill="#4CAF50" />
      <ellipse cx="10" cy="3.5" rx="1.6" ry="4.5" fill="#66BB6A" />
      <ellipse cx="12.5" cy="4.5" rx="1.8" ry="4" transform="rotate(18 12.5 4.5)" fill="#4CAF50" />
      {/* Body */}
      <path d="M5.5 8 C5.5 8, 4 13.5, 10 19 C16 13.5, 14.5 8, 14.5 8 Z" fill="#FF8A00" />
      <path d="M7.5 8 C7.5 8, 6.5 13, 10 18 C13.5 13, 12.5 8, 12.5 8 Z" fill="#FFA040" opacity="0.55" />
      {/* Top cap */}
      <ellipse cx="10" cy="8" rx="5" ry="1.8" fill="#FF8A00" />
      {/* Eyes */}
      <circle cx="8.2" cy="11.5" r="0.9" fill="#D35400" />
      <circle cx="11.8" cy="11.5" r="0.9" fill="#D35400" />
      {/* Smile */}
      <path d="M8.8 13.5 Q10 14.8 11.2 13.5" stroke="#D35400" strokeWidth="0.9" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── CarrotMusic ──────────────────────────────────────────────────────────────
// Large carrot with floating music notes. Cute face. 64×64 default.
export function CarrotMusic({ className, size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Floating music notes */}
      {/* Note top-left */}
      <g opacity="0.7">
        <text x="3" y="16" fontSize="11" fill="#FF8A00" fontFamily="serif">♪</text>
      </g>
      {/* Note top-right */}
      <g opacity="0.6">
        <text x="49" y="13" fontSize="9" fill="#FFA040" fontFamily="serif">♫</text>
      </g>
      {/* Note right-mid */}
      <g opacity="0.5">
        <text x="53" y="32" fontSize="8" fill="#FF8A00" fontFamily="serif">♩</text>
      </g>
      {/* Note left-mid */}
      <g opacity="0.55">
        <text x="2" y="36" fontSize="8" fill="#FFA040" fontFamily="serif">♪</text>
      </g>

      {/* Leaves */}
      <ellipse cx="22" cy="14" rx="5" ry="12" transform="rotate(-18 22 14)" fill="#4CAF50" />
      <ellipse cx="28" cy="10" rx="4.5" ry="14" fill="#66BB6A" />
      <ellipse cx="34" cy="14" rx="5" ry="12" transform="rotate(18 34 14)" fill="#4CAF50" />

      {/* Body */}
      <path d="M14 26 C14 26, 10 44, 28 60 C46 44, 42 26, 42 26 Z" fill="#FF8A00" />
      <path d="M19 26 C19 26, 16 42, 28 57 C40 42, 37 26, 37 26 Z" fill="#FFA040" opacity="0.55" />

      {/* Top cap */}
      <ellipse cx="28" cy="26" rx="14" ry="5" fill="#FF8A00" />

      {/* Eyes */}
      <circle cx="23" cy="35" r="2" fill="#D35400" />
      <circle cx="33" cy="35" r="2" fill="#D35400" />

      {/* Happy smile */}
      <path d="M24 41 Q28 45 32 41" stroke="#D35400" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <circle cx="19" cy="40" r="2.5" fill="#FFB74D" opacity="0.45" />
      <circle cx="37" cy="40" r="2.5" fill="#FFB74D" opacity="0.45" />
    </svg>
  );
}

// ─── CarrotSearch ─────────────────────────────────────────────────────────────
// Large carrot holding a magnifying glass. 64×64 default.
export function CarrotSearch({ className, size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaves */}
      <ellipse cx="22" cy="13" rx="5" ry="12" transform="rotate(-18 22 13)" fill="#4CAF50" />
      <ellipse cx="28" cy="9" rx="4.5" ry="14" fill="#66BB6A" />
      <ellipse cx="34" cy="13" rx="5" ry="12" transform="rotate(18 34 13)" fill="#4CAF50" />

      {/* Body */}
      <path d="M14 25 C14 25, 10 44, 28 60 C46 44, 42 25, 42 25 Z" fill="#FF8A00" />
      <path d="M19 25 C19 25, 16 42, 28 57 C40 42, 37 25, 37 25 Z" fill="#FFA040" opacity="0.55" />

      {/* Top cap */}
      <ellipse cx="28" cy="25" rx="14" ry="5" fill="#FF8A00" />

      {/* Eyes — looking right toward the glass */}
      <circle cx="23.5" cy="33.5" r="1.8" fill="#D35400" />
      <circle cx="31.5" cy="33" r="1.8" fill="#D35400" />
      {/* Eye pupils shifted right */}
      <circle cx="24.5" cy="33.5" r="0.8" fill="#8B3A00" />
      <circle cx="32.5" cy="33" r="0.8" fill="#8B3A00" />

      {/* Curious smile */}
      <path d="M24 39 Q27.5 42.5 31 39" stroke="#D35400" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <circle cx="19.5" cy="38" r="2.2" fill="#FFB74D" opacity="0.45" />
      <circle cx="36.5" cy="38" r="2.2" fill="#FFB74D" opacity="0.45" />

      {/* Magnifying glass — held to the right */}
      {/* Glass circle */}
      <circle cx="49" cy="22" r="7.5" stroke="#D35400" strokeWidth="2.2" fill="white" fillOpacity="0.6" />
      {/* Glass shine */}
      <circle cx="46.5" cy="19.5" r="1.5" fill="white" opacity="0.7" />
      {/* Handle */}
      <line x1="54" y1="27" x2="59" y2="33" stroke="#D35400" strokeWidth="2.5" strokeLinecap="round" />

      {/* Arm/leaf holding the glass */}
      <path
        d="M40 30 Q44 25 47 23"
        stroke="#4CAF50"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ─── CarrotCheck ──────────────────────────────────────────────────────────────
// Carrot with a green checkmark badge. Happy face. 32×32 default.
export function CarrotCheck({ className, size = 32 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaves */}
      <ellipse cx="10" cy="7.5" rx="2.8" ry="6.5" transform="rotate(-18 10 7.5)" fill="#4CAF50" />
      <ellipse cx="14" cy="5.5" rx="2.5" ry="7.5" fill="#66BB6A" />
      <ellipse cx="18" cy="7.5" rx="2.8" ry="6.5" transform="rotate(18 18 7.5)" fill="#4CAF50" />

      {/* Body */}
      <path d="M6 13 C6 13, 4 21, 14 29.5 C24 21, 22 13, 22 13 Z" fill="#FF8A00" />
      <path d="M9 13 C9 13, 7.5 20, 14 28 C20.5 20, 19 13, 19 13 Z" fill="#FFA040" opacity="0.55" />

      {/* Top cap */}
      <ellipse cx="14" cy="13" rx="8.5" ry="2.8" fill="#FF8A00" />

      {/* Eyes — happy crescent */}
      <path d="M11.5 18.5 Q12.5 17 13.5 18.5" stroke="#D35400" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M16.5 18.5 Q17.5 17 18.5 18.5" stroke="#D35400" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Big smile */}
      <path d="M12 21.5 Q14 24 17 21.5" stroke="#D35400" strokeWidth="1.3" strokeLinecap="round" fill="none" />

      {/* Blush */}
      <circle cx="10" cy="21" r="1.5" fill="#FFB74D" opacity="0.5" />
      <circle cx="20" cy="21" r="1.5" fill="#FFB74D" opacity="0.5" />

      {/* Checkmark badge — bottom right */}
      <circle cx="24" cy="24" r="5.5" fill="#4CAF50" />
      <path d="M21.5 24 L23 25.8 L26.5 22" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─── CarrotEmpty ──────────────────────────────────────────────────────────────
// Carrot shrugging with raised leaf-arms and "meh" expression. 64×64 default.
export function CarrotEmpty({ className, size = 64 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Leaves — center */}
      <ellipse cx="26" cy="12" rx="4.5" ry="12" transform="rotate(-10 26 12)" fill="#4CAF50" />
      <ellipse cx="32" cy="9" rx="4" ry="13" fill="#66BB6A" />
      <ellipse cx="38" cy="12" rx="4.5" ry="12" transform="rotate(10 38 12)" fill="#4CAF50" />

      {/* Left shrug arm — raised outward */}
      <path
        d="M16 34 Q9 28 5 22"
        stroke="#4CAF50"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left hand nub */}
      <ellipse cx="5" cy="21" rx="3" ry="4" transform="rotate(-30 5 21)" fill="#66BB6A" />

      {/* Right shrug arm — raised outward */}
      <path
        d="M48 34 Q55 28 59 22"
        stroke="#4CAF50"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right hand nub */}
      <ellipse cx="59" cy="21" rx="3" ry="4" transform="rotate(30 59 21)" fill="#66BB6A" />

      {/* Body */}
      <path d="M16 26 C16 26, 12 44, 32 62 C52 44, 48 26, 48 26 Z" fill="#FF8A00" />
      <path d="M22 26 C22 26, 19 42, 32 59 C45 42, 42 26, 42 26 Z" fill="#FFA040" opacity="0.55" />

      {/* Top cap */}
      <ellipse cx="32" cy="26" rx="16" ry="5.5" fill="#FF8A00" />

      {/* Eyes — flat/meh */}
      <rect x="25" y="33.5" width="5" height="2" rx="1" fill="#D35400" />
      <rect x="34" y="33.5" width="5" height="2" rx="1" fill="#D35400" />

      {/* Flat mouth — meh */}
      <line x1="27" y1="40.5" x2="37" y2="40.5" stroke="#D35400" strokeWidth="1.8" strokeLinecap="round" />

      {/* Blush */}
      <circle cx="23" cy="39" r="2.8" fill="#FFB74D" opacity="0.4" />
      <circle cx="41" cy="39" r="2.8" fill="#FFB74D" opacity="0.4" />
    </svg>
  );
}
