"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatPrice } from "@/components/formatprice"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("featured")

  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (productsError) throw productsError
      
      setProducts(productsData || [])

      // Extract unique categories from products
      const uniqueCategories = Array.from(
        new Set(productsData?.map(item => item.category).filter(Boolean) || [])
      )
      setCategories(uniqueCategories)

      // Extract unique colors from products
      const allColors = productsData?.flatMap(product => 
        Array.isArray(product.colors) ? product.colors : []
      ) || []
      const uniqueColors = Array.from(new Set(allColors)).filter(Boolean)
      setColors(uniqueColors)

    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedColor) {
      filtered = filtered.filter((p) => {
        if (!p.colors || !Array.isArray(p.colors)) return false
        return p.colors.includes(selectedColor)
      })
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return filtered
  }, [products, selectedCategory, selectedColor, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="font-grotesk text-3xl font-bold text-foreground mb-8">Shop Paint Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-6 sticky top-20">
              {/* Category Filter */}
              <div>
                <h3 className="font-grotesk font-bold text-foreground mb-4">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-4 py-2 rounded transition ${
                      selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded transition ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              {colors.length > 0 && (
                <div>
                  <h3 className="font-grotesk font-bold text-foreground mb-4">Color</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedColor("")}
                      className={`w-full text-left px-4 py-2 rounded transition ${
                        selectedColor === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      All Colors
                    </button>
                    {colors.slice(0, 8).map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-full text-left px-4 py-2 rounded transition ${
                          selectedColor === color
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort */}
              <div>
                <h3 className="font-grotesk font-bold text-foreground mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary font-medium mb-1">{product.category}</p>
                      <h3 className="font-grotesk font-bold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-grotesk font-bold text-lg text-foreground">
                           {formatPrice(product.price || 0)}

                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-secondary fill-secondary" />
                            <span className="text-xs text-foreground">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Colors: {product.colors.slice(0, 3).join(", ")}
                          {product.colors.length > 3 && "..."}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                <p className="text-muted-foreground text-sm mt-2">Try selecting different filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}