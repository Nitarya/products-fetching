import { memo, useMemo } from 'react'

/**
 * Builds the page-number list with ellipsis gaps, e.g.
 * [1, '…', 4, 5, 6, '…', 12] for a 12-page result set.
 */
function buildPageItems(current, total) {
  const candidates = new Set([1, total, current - 1, current, current + 1])
  const pages = [...candidates]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const items = []
  let prev = 0
  for (const p of pages) {
    if (p - prev > 1) items.push('…')
    items.push(p)
    prev = p
  }
  return items
}

function PageButton({ active, onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'grid size-9 place-items-center rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-600/30'
          : 'grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40'
      }
    >
      {children}
    </button>
  )
}

function Pagination({ page, totalPages, onChange }) {
  const items = useMemo(
    () => buildPageItems(page, totalPages),
    [page, totalPages],
  )

  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-10"
    >
      <PageButton onClick={() => onChange(page - 1)} disabled={page === 1}>
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </PageButton>

      {items.map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <PageButton
            key={item}
            active={item === page}
            onClick={() => onChange(item)}
          >
            {item}
          </PageButton>
        ),
      )}

      <PageButton onClick={() => onChange(page + 1)} disabled={page === totalPages}>
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </PageButton>
    </nav>
  )
}

export default memo(Pagination)
