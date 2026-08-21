export default function Logo({ className = 'h-7 w-7 sm:h-8 sm:w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 76" className={className} aria-hidden="true">
      <path d="M12 8 L14.5 14.5 L21 17 L14.5 19.5 L12 26 L9.5 19.5 L3 17 L9.5 14.5 Z" fill="#D9A441" />

      <path
        d="M4 42
           C4 28 16 20 30 20
           C42 20 49 27 50 36
           C51 27 58 20 70 20
           C84 20 96 28 96 42
           C96 56 84 64 70 64
           C58 64 51 57 50 48
           C49 57 42 64 30 64
           C16 64 4 56 4 42 Z"
        fill="#7C1C2C"
        stroke="#D9A441"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      <ellipse cx="26" cy="42" rx="14" ry="11" fill="#FFF9F3" transform="rotate(-10 26 42)" />
      <ellipse cx="74" cy="42" rx="14" ry="11" fill="#FFF9F3" transform="rotate(10 74 42)" />

      <g transform="translate(62 -2) rotate(-12 20 20)">
        <ellipse cx="20" cy="24" rx="15" ry="4.2" fill="#12213B" />
        <rect x="10" y="6" width="20" height="19" rx="2" fill="#12213B" />
        <rect x="10" y="17" width="20" height="4.5" fill="#D9A441" />
      </g>
    </svg>
  )
}
