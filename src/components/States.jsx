/** Friendly empty state shown when search/filter matches nothing. */
export function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-slate-100">
        <svg
          className="size-8 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          No products found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {hasFilters
            ? 'Try a different search term or clear your filters.'
            : 'The catalog is empty right now — check back soon.'}
        </p>
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

/** Error state with a retry action. */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-100 bg-rose-50 px-6 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-rose-100">
        <svg
          className="size-8 text-rose-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Couldn&apos;t load products
        </h3>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
      >
        Try again
      </button>
    </div>
  )
}
