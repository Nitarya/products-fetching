import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import ProductList from './ProductList'
import { useProducts } from './hooks/useProducts'

function App() {
  // Single fetch, shared by the hero stats and the product list.
  const { products, loading, error, refetch } = useProducts()
  const categoryCount = new Set(products.map((p) => p.category)).size

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main>
        <Hero productCount={products.length} categoryCount={categoryCount} />
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
