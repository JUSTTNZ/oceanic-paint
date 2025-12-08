"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, Shield, Truck, Palette, CheckCircle, Sparkles } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseBrowserClient()

  const categoryColors: Record<string, string> = {
    "Interior": "bg-blue-100 text-blue-700",
    "Exterior": "bg-green-100 text-green-700",
    "Gloss": "bg-yellow-100 text-yellow-700",
    "Matte": "bg-purple-100 text-purple-700",
    "Primer": "bg-gray-100 text-gray-700",
    "Varnish": "bg-amber-100 text-amber-700",
    "Eco-Friendly": "bg-emerald-100 text-emerald-700",
  }

  const getCategoryColor = (category: string): string => {
    return categoryColors[category] || "bg-primary/10 text-primary"
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4)
      if (productsError) throw productsError
      setFeaturedProducts(products || [])

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("products")
        .select("category")
      if (categoriesError) throw categoriesError

      const uniqueCategories = Array.from(
        new Set(categoriesData?.map(item => item.category).filter(Boolean) || [])
      )
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching data:", err)
      setCategories(["Interior", "Exterior", "Gloss", "Matte", "Eco-Friendly"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Text */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Transform <span className="text-primary">Your Space</span> With Oceanic Paints
            </h1>
            <p className="text-lg text-muted-foreground">
              Premium paints with vibrant colors, durability, and eco-friendly formulations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Explore Collection
              </Link>
              <Link
                href="/build-order"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
              >
                Custom Order
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/paint-bucket.jpg"
                alt="Paint Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/80 rounded-xl shadow">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-green-100 rounded-lg">
              <Shield size={24} className="text-green-600" />
            </div>
            <p className="font-semibold">10-Year Warranty</p>
          </div>
          <div className="text-center p-6 bg-white/80 rounded-xl shadow">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-100 rounded-lg">
              <Truck size={24} className="text-blue-600" />
            </div>
            <p className="font-semibold">Free Shipping</p>
          </div>
          <div className="text-center p-6 bg-white/80 rounded-xl shadow">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-purple-100 rounded-lg">
              <Palette size={24} className="text-purple-600" />
            </div>
            <p className="font-semibold">50+ Colors</p>
          </div>
          <div className="text-center p-6 bg-white/80 rounded-xl shadow">
            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <p className="font-semibold">Eco-Friendly</p>
          </div>
        </div>
      </section> */}

      {/* Categories Section */}
      {/* <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Explore Our <span className="text-primary">Collections</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-40 bg-muted rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map(category => {
                const colorClass = getCategoryColor(category)
                const [bgColor, textColor] = colorClass.split(' ')
                return (
                  <Link
                    key={category}
                    href={`/products?category=${category}`}
                    className={`flex flex-col items-center p-6 rounded-xl border border-border hover:shadow-lg transition ${bgColor} ${textColor}`}
                  >
                    <span className="text-3xl font-bold">{category.charAt(0)}</span>
                    <h3 className="mt-3 text-lg font-semibold">{category}</h3>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section> */}

      {/* Featured Products Section */}
      <section className="py-20 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured <span className="text-primary">Products</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-64 bg-muted rounded-xl" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No Products Yet</p>
              <Link
                href="/admin/products"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
              >
                Add Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
                >
                  <div className="relative h-64">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Palette size={48} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-muted-foreground mb-2 line-clamp-2">
                      {product.description || "Premium quality paint for your project"}
                    </p>
                    <span className="font-bold text-foreground">${product.price?.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              View All Products <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-primary">Transform</span> Your Space?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Create a custom paint order tailored to your project needs or explore our premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/build-order"
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Build Your Order
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/10 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
