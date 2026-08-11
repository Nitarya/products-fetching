import { useCallback, useEffect, useState } from 'react'

/**
 * Fetches the full product catalog from the DummyJSON API.
 * Returns the products list plus loading / error state and a refetch trigger.
 *
 * Loading is toggled from event handlers (initial state + refetch), and the
 * effect only sets state asynchronously after the request settles, so there
 * are no synchronous setState calls inside the effect body.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      try {
        // limit=0 asks DummyJSON for the complete catalog in one request
        const res = await fetch('https://dummyjson.com/products?limit=0', {
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        const data = await res.json()
        if (!cancelled) {
          setProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading products.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey])

  return { products, loading, error, refetch }
}
