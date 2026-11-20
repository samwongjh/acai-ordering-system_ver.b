export function RecruitMascot({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cute little leaf sprout */}
      <path
        d="M24 13C24 9 27.5 6 31.5 6.5C31 10.5 28 13 24 13Z"
        fill="#4D9B6A"
      />
      <path
        d="M24 13C24 9.5 20.5 7.5 17.5 8.5C18.5 11.5 21 13.5 24 13Z"
        fill="#6BC087"
      />
      <path
        d="M24 11.5V15"
        stroke="#3A7D53"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Plump acai berry body */}
      <circle cx="24" cy="28" r="14" fill="#5B2378" />
      <ellipse cx="19" cy="22" rx="4" ry="2.2" transform="rotate(-25 19 22)" fill="#7B3B9E" opacity="0.55" />
      {/* Rosy cheeks */}
      <ellipse cx="16.5" cy="30.5" rx="2.6" ry="1.6" fill="#F48FB1" opacity="0.75" />
      <ellipse cx="31.5" cy="30.5" rx="2.6" ry="1.6" fill="#F48FB1" opacity="0.75" />
      {/* Eyes */}
      <circle cx="19" cy="27" r="1.8" fill="#FFFDF9" />
      <circle cx="29" cy="27" r="1.8" fill="#FFFDF9" />
      <circle cx="19.5" cy="26.5" r="0.6" fill="#1C1523" />
      <circle cx="29.5" cy="26.5" r="0.6" fill="#1C1523" />
      {/* Sweet smile */}
      <path
        d="M21.5 31C22.4 32.3 25.6 32.3 26.5 31"
        stroke="#FFFDF9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WarriorMascot({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cute wooden spoon tucked behind */}
      <path
        d="M36 9L40 13L31 24L27 20L36 9Z"
        fill="#D89B56"
      />
      <ellipse cx="38.5" cy="10.5" rx="3.4" ry="4.4" transform="rotate(42 38.5 10.5)" fill="#EAB272" />
      {/* Plump berry warrior body */}
      <circle cx="23" cy="28" r="14" fill="#5B2378" />
      {/* Warrior headband */}
      <path
        d="M9.8 22.5C14 20.8 32 20.8 36.2 22.5L36.8 25.5C32 24 14 24 9.2 25.5L9.8 22.5Z"
        fill="#F59E0B"
      />
      {/* Headband ribbon tails */}
      <path d="M9.5 23.5L5.5 21L6.8 24.5L4.5 26.5L9.5 25.2Z" fill="#D97706" />
      {/* Rosy cheeks */}
      <ellipse cx="15.5" cy="31.5" rx="2.5" ry="1.5" fill="#F48FB1" opacity="0.8" />
      <ellipse cx="30.5" cy="31.5" rx="2.5" ry="1.5" fill="#F48FB1" opacity="0.8" />
      {/* Sparkly determined eyes */}
      <circle cx="18" cy="28.5" r="2" fill="#FFFDF9" />
      <circle cx="28" cy="28.5" r="2" fill="#FFFDF9" />
      <circle cx="18.6" cy="28.1" r="0.7" fill="#1C1523" />
      <circle cx="28.6" cy="28.1" r="0.7" fill="#1C1523" />
      {/* Cheerful grin */}
      <path
        d="M20.2 32.5C21.5 34 24.5 34 25.8 32.5"
        stroke="#FFFDF9"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LegendMascot({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tiny celebratory sparkles */}
      <path d="M8 14L9 16.5L11.5 17.5L9 18.5L8 21L7 18.5L4.5 17.5L7 16.5L8 14Z" fill="#F59E0B" />
      <path d="M40 15L40.8 17L42.8 17.8L40.8 18.6L40 20.6L39.2 18.6L37.2 17.8L39.2 17L40 15Z" fill="#F59E0B" />
      {/* Little golden crown perched on head */}
      <path
        d="M16.5 15.5L15 8.5L20.5 12L24 7L27.5 12L33 8.5L31.5 15.5H16.5Z"
        fill="#F59E0B"
      />
      <circle cx="15" cy="8" r="1.3" fill="#FBBF24" />
      <circle cx="24" cy="6.5" r="1.5" fill="#FBBF24" />
      <circle cx="33" cy="8" r="1.3" fill="#FBBF24" />
      {/* Plump royal acai body */}
      <circle cx="24" cy="29" r="14" fill="#5B2378" />
      {/* Cute little ears / arms */}
      <circle cx="10.5" cy="30" r="2.6" fill="#6F2E91" />
      <circle cx="37.5" cy="30" r="2.6" fill="#6F2E91" />
      {/* Rosy cheeks */}
      <ellipse cx="16.5" cy="31.5" rx="2.7" ry="1.6" fill="#F48FB1" opacity="0.8" />
      <ellipse cx="31.5" cy="31.5" rx="2.7" ry="1.6" fill="#F48FB1" opacity="0.8" />
      {/* Happy curved eyes */}
      <path
        d="M17 28C17.6 26.5 19.9 26.5 20.5 28"
        stroke="#FFFDF9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.5 28C28.1 26.5 30.4 26.5 31 28"
        stroke="#FFFDF9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Joyful smile */}
      <path
        d="M21 32C22.2 34.2 25.8 34.2 27 32Z"
        fill="#F48FB1"
        stroke="#FFFDF9"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
