const paths = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  pulse: 'M2 12h5l3-8 4 16 3-8h5',
  card: 'M3 5h18v14H3zM3 9h18M6 15h4',
  refresh: 'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6',
  check: 'm5 12 4 4L19 6',
  bolt: 'm13 2-9 12h7l-1 8 10-13h-7z',
};

export function Icon({ type = 'grid' }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[type] || paths.grid} />
    </svg>
  );
}
