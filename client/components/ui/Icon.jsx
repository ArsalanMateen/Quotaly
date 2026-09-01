const paths = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  pulse: "M2 12h5l3-8 4 16 3-8h5",
  card: "M3 5h18v14H3zM3 9h18M6 15h4",
  refresh: "M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6",
  check: "m5 12 4 4L19 6",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7z",
  sparkle: "M12 3.5v17M3.5 12h17M6 6l12 12M6 18l12-12",
  asterisk: "M12 3.5v17M3.5 12h17M6 6l12 12M6 18l12-12",
};

export function Icon({ type, size = 19, strokeWidth = 1.6, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[type]} />
    </svg>
  );
}
