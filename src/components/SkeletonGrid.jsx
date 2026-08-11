const SKELETON_COUNT = 8

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
          <div className="size-9 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

/** Loading placeholder grid shown while products are being fetched. */
export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
