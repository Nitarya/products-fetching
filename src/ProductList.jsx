import { useCallback, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard'
import Pagination from './components/Pagination'
import SkeletonGrid from './components/SkeletonGrid'
import { EmptyState, ErrorState } from './components/States'

const PAGE_SIZE = 10

function SearchIcon() {
  return (
    <svg
      className="size-5 text-slate-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  )
}

export default function ProductList({ products, loading, error, onRetry }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  /** Distinct categories, kept sorted for a stable dropdown order. */
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products],
  )

  /** Search + filter + sort pipeline — derived purely, no extra state. */
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    let result = products

    if (query) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(query),
      )
    }
    if (category) {
      result = result.filter((p) => p.category === category)
    }
    if (sort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }
    return result
  }, [products, search, category, sort])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  // Keep the visible page in range if the result set shrinks.
  // (Adjusting state during render — the documented React pattern.)
  if (page > totalPages) {
    setPage(totalPages)
  }

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, page])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /** Search/filter/sort changes always restart from page 1. */
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
    setPage(1)
  }, [])

  const handleCategoryChange = useCallback((cat) => {
    setCategory((prev) => (prev === cat ? '' : cat))
    setPage(1)
  }, [])

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value)
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setSearch('')
    setCategory('')
    setSort('')
    setPage(1)
  }, [])

  const from = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, filteredProducts.length)

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <label className="relative flex-1">
                <span className="sr-only">Search products</span>
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search products…"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              {/* Sort */}
              <label className="relative sm:w-56">
                <span className="sr-only">Sort by price</span>
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-medium text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">Sort: Featured</option>
                  <option value="asc">Price: Low → High</option>
                  <option value="desc">Price: High → Low</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="size-4 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </label>
            </div>

            {/* Category pills */}
            <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={
                  category === ''
                    ? 'shrink-0 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white'
                    : 'shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
                }
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={
                    category === cat
                      ? 'shrink-0 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white'
                      : 'shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
                  }
                >
                  {cat.replaceAll('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-40 px-4 pt-8 sm:px-6 lg:px-8">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            hasFilters={Boolean(search.trim() || category || sort)}
            onReset={handleReset}
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {from}–{to}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900">
                  {filteredProducts.length}
                </span>{' '}
                products
              </p>
              {(search.trim() || category || sort) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </>
        )}
      </section>
    </>
  )
}
