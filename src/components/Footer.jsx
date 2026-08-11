const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: ['New arrivals', 'Best sellers', 'Deals', 'Gift cards'],
  },
  {
    title: 'Company',
    links: ['About us', 'Careers', 'Press', 'Contact'],
  },
  {
    title: 'Support',
    links: ['Help center', 'Shipping', 'Returns', 'Privacy policy'],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                Nitya&apos;s <span className="text-indigo-600">Products</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              A beautifully crafted product catalog demo. Search, filter and
              sort your way through a curated collection.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition hover:text-indigo-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Nitya&apos;s Products. Demo data by{' '}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-500 hover:text-indigo-600"
            >
              DummyJSON
            </a>
            .
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="#" className="transition hover:text-slate-600">
              Terms
            </a>
            <a href="#" className="transition hover:text-slate-600">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
