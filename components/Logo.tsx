// Logo Balia — marque (combiné vocal + point d'accent « appel capté ») +
// wordmark. Direction artistique Tome 21 : chaleureux, lisible, une couleur
// d'accent. Placeholder de départ, à remplacer par le kit de marque final.

export function Logo({
  size = 26,
  wordmark = true,
}: {
  size?: number;
  wordmark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        role="img"
      >
        <rect width="32" height="32" rx="9" fill="#0f766e" />
        <g transform="translate(6.4 6.2) scale(0.8)">
          <path
            d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
            fill="#ffffff"
          />
        </g>
        <circle
          cx="24.5"
          cy="7.5"
          r="4.6"
          fill="#f59e0b"
          stroke="#0f766e"
          strokeWidth="1.5"
        />
      </svg>
      {wordmark && (
        <span className="text-xl font-bold tracking-tight text-balia">
          Balia
        </span>
      )}
    </span>
  );
}
