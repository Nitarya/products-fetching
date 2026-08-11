const STAR_COUNT = 5

function StarIcon() {
  return (
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.363 1.118l1.286 3.958c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 0 0-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.286-3.958a1 1 0 0 0-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.958Z" />
    </svg>
  )
}

/**
 * Renders a 5-star rating using a filled-overlay technique,
 * so partial ratings (e.g. 4.3) fill precisely the right amount.
 */
export default function Stars({ rating }) {
  const fillPercent = Math.max(0, Math.min(100, (rating / STAR_COUNT) * 100))

  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <span className="flex gap-0.5 text-slate-200">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400"
        style={{ width: `${fillPercent}%` }}
      >
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
    </span>
  )
}
