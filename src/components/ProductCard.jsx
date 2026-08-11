import { memo, useState } from 'react'
import Stars from './Stars'

function ImageFallback() {
  return (
    <div className="grid size-full place-items-center bg-gradient-to-br from-slate-100 to-slate-200">
      <svg
        className="size-12 text-slate-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    </div>
  )
}

/**
 * A single product card. Wrapped in React.memo so cards are only
 * re-rendered when their own product data changes — not on keystrokes
 * in the search box or page changes.
 */
function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false)
  const src = product.images?.[0] || product.thumbnail
  const discount = Number(product.discountPercentage) || 0
  const stock = Number(product.stock) || 0
  const price = Number(product.price) || 0
  const rating = Number(product.rating) || 0
  const isOut = stock === 0
  const isLow = !isOut && stock <= 10

  // Stable stagger keyed off the product id, so memo() still prevents
  // re-renders when cards shift position (search keystrokes, page turns).
  const stagger = (product.id % 8) * 40

  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 animate-fade-up"
      style={{ animationDelay: `${stagger}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {imgError ? (
          <ImageFallback />
        ) : (
          <img
            src={src}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-md shadow-rose-500/30">
            -{Math.round(discount)}%
          </span>
        )}

        {isOut && (
          <span className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
              Out of stock
            </span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="inline-flex w-fit rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
          {product.category.replaceAll('-', ' ')}
        </span>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-slate-900">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Stars rating={rating} />
          <span className="text-xs font-medium text-slate-500">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price + add to cart */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            disabled={isOut}
            className="grid size-9 place-items-center rounded-full bg-slate-900 text-white transition-all duration-200 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        {/* Stock indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {isOut ? (
            <span className="inline-flex items-center gap-1 text-rose-500">
              <span className="size-1.5 rounded-full bg-rose-500" />
              Out of stock
            </span>
          ) : isLow ? (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Only {stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
