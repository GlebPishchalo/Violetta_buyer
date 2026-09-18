"use client";

type RatingProps = {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  label?: string;
};

function Star({
  filled,
  size,
}: {
  filled: boolean;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M12 2.5l2.9 6.1 6.7.9-4.8 4.6 1.2 6.6L12 17.8 6 20.7l1.2-6.6L2.4 9.5l6.7-.9L12 2.5z"
        fill={filled ? "#C9A227" : "none"}
        stroke={filled ? "#C9A227" : "#8A8A93"}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Rating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 18,
  className = "",
  label,
}: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (!interactive) {
    return (
      <div
        className={`flex items-center gap-1 ${className}`.trim()}
        role="img"
        aria-label={label ?? `${value} / ${max}`}
      >
        {stars.map((n) => (
          <Star key={n} filled={n <= value} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 ${className}`.trim()}
      role="radiogroup"
      aria-label={label}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}`}
          onClick={() => onChange?.(n)}
          className="rounded-sm p-0.5 transition-transform hover:scale-110"
        >
          <Star filled={n <= value} size={size} />
        </button>
      ))}
    </div>
  );
}
