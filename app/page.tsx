"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch products (limit to 3 for featured)
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
      
      if (productsError) throw productsError
      
      setFeaturedProducts(products || [])

      // Fetch distinct categories from products
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("products")
        .select("category")
      
      if (categoriesError) throw categoriesError
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(categoriesData?.map(item => item.category).filter(Boolean) || [])
      )
      setCategories(uniqueCategories)

    } catch (err) {
      console.error("Error fetching data:", err)
      // Fallback to mock categories if needed
      setCategories(["Interior", "Exterior", "Gloss", "Matte", "Eco-Friendly"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="font-grotesk text-4xl md:text-5xl font-bold text-foreground mb-4">
              Premium Paint for Every Project
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover Evans Paints' collection of high-quality interior, exterior, and specialty finishes. Transform
              your spaces with vibrant, durable colors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="px-6 py-3 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
              >
                Shop Now
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/build-order"
                className="px-6 py-3 border border-primary text-primary rounded font-medium hover:bg-primary/5 transition inline-flex items-center justify-center gap-2"
              >
                Build Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-grotesk text-3xl font-bold text-foreground mb-12 text-center">Shop by Category</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${category}`}
                  className="p-6 border border-border rounded-lg hover:border-primary hover:shadow-md transition text-center group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 group-hover:bg-primary/20 transition" />
                  <h3 className="font-grotesk font-bold text-foreground group-hover:text-primary transition">
                    {category}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-grotesk text-3xl font-bold text-foreground mb-12 text-center">Featured Products</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <Link
                href="/admin/products"
                className="mt-4 inline-block px-6 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
              >
                Add Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
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
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
                    <h3 className="font-grotesk font-bold text-lg text-foreground mb-2 group-hover:text-primary transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-grotesk text-xl font-bold text-foreground">
                        ${product.price?.toFixed(2) || "0.00"}
                      </span>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-secondary fill-secondary" />
                          <span className="text-sm text-foreground">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-grotesk text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg opacity-90 mb-8">
            Create a custom paint order tailored to your project needs and preferences.
          </p>
          <Link
            href="/build-order"
            className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded font-bold hover:opacity-90 transition"
          >
            Start Building Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}