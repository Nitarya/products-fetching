function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-indigo-200">
        {label}
      </p>
    </div>
  )
}

export default function Hero({ productCount, categoryCount }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 size-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl"
      />
      {/* Dot pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-100 backdrop-blur">
          <span className="size-1.5 rounded-full bg-emerald-300" />
          Curated collection · Updated daily
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Discover products{' '}
          <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200 bg-clip-text text-transparent">
            you&apos;ll love
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-indigo-100 sm:text-lg">
          Browse a hand-picked catalog with live search, smart filters and
          instant sorting — everything you need, in one beautiful place.
        </p>

        <div className="mx-auto mt-10 flex max-w-md items-center justify-center divide-x divide-white/20">
          <div className="flex-1">
            <Stat value={`${productCount}+`} label="Products" />
          </div>
          <div className="flex-1">
            <Stat value={`${categoryCount}`} label="Categories" />
          </div>
          <div className="flex-1">
            <Stat value="24h" label="Delivery" />
          </div>
        </div>
      </div>

      {/* Curved transition into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-10 rounded-t-[2.5rem] bg-slate-50" />
    </section>
  )
}
