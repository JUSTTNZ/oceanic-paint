"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, Sparkles, Shield, Truck, Palette, CheckCircle } from "lucide-react"
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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
  {/* Background with gradient and paint splatter effect */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
    
    {/* Animated paint splatters */}
    <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
    
    {/* Unsplash Paint Texture Background - FIXED */}
    <div className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=3840&q=10')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    />
    
    {/* Additional overlay for better readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60" />
  </div>

  {/* Content */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Text Content */}
      <div className="space-y-8">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Premium Quality Paints</span>
        </div>
        
        <h1 className="font-grotesk text-5xl md:text-6xl lg:text-6xl font-bold text-foreground leading-tight">
          Transform
          <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Your Space
          </span>
          <span className="block mt-2 text-4xl md:text-5xl font-normal text-muted-foreground">
            With Oceanic Paints
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Experience the perfect blend of innovation and elegance. 
          Our premium paint collection brings vibrant colors to life with 
          exceptional durability and eco-friendly formulations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/products"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 inline-flex items-center justify-center gap-3 overflow-hidden transform hover:-translate-y-1"
          >
            <span className="relative z-10 text-lg">Explore Collection</span>
            <ChevronRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          
          <Link
            href="/build-order"
            className="group relative px-8 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-primary/20 text-primary rounded-xl font-semibold hover:border-primary/40 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-3 hover:-translate-y-1"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold text-lg">
              Custom Order
            </span>
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center group-hover:border-primary/40 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <span className="text-primary group-hover:scale-110 transition-transform">+</span>
            </div>
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
          <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Shield size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <span className="text-sm font-semibold block">10-Year</span>
              <span className="text-xs text-muted-foreground">Warranty</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Truck size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-semibold block">Free</span>
              <span className="text-xs text-muted-foreground">Shipping</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Palette size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <span className="text-sm font-semibold block">50+</span>
              <span className="text-xs text-muted-foreground">Colors</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-semibold block">Eco</span>
              <span className="text-xs text-muted-foreground">Friendly</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image/Visual Section */}
      <div className="relative lg:block hidden">
        <div className="relative group">
          {/* Main product visual */}
          <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
            
            {/* Paint can 3D visualization */}
            <div className="absolute -top-6 -right-6 w-24 h-32 bg-gradient-to-b from-primary to-primary/80 rounded-lg shadow-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-6 transition-transform duration-300">
              <Palette size={32} className="text-white" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-white/40 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Palette size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Interior Paints</h3>
                <p className="text-sm text-muted-foreground">Vibrant, long-lasting colors for your home</p>
                <div className="flex gap-1 mt-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                  <div className="w-6 h-6 rounded-full bg-cyan-500"></div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-white/40 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Exterior Paints</h3>
                <p className="text-sm text-muted-foreground">Weather-resistant all-climate protection</p>
                <div className="flex gap-1 mt-3">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                  <div className="w-6 h-6 rounded-full bg-teal-500"></div>
                  <div className="w-6 h-6 rounded-full bg-lime-500"></div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-white/40 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Specialty Finishes</h3>
                <p className="text-sm text-muted-foreground">Matte, gloss & metallic options</p>
                <div className="flex gap-1 mt-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                  <div className="w-6 h-6 rounded-full bg-pink-500"></div>
                  <div className="w-6 h-6 rounded-full bg-rose-500"></div>
                  <div className="w-6 h-6 rounded-full bg-fuchsia-500"></div>
                </div>
              </div>
              
              <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-white/40 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Zero VOC, environmentally safe</p>
                <div className="flex gap-1 mt-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                  <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                </div>
              </div>
            </div>
            
            {/* Floating paint drops */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-accent rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 mt-12 text-center">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">24h</div>
            <div className="text-sm text-muted-foreground">Delivery Time</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Scroll indicator */}

</section>
      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Collections</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the perfect paint for every surface and style
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-40 bg-muted rounded-2xl mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => {
                const colorClass = getCategoryColor(category)
                const [bgColor, textColor] = colorClass.split(' ')
                
                return (
                  <Link
                    key={category}
                    href={`/products?category=${category}`}
                    className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className={`w-20 h-20 ${bgColor} rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${textColor}`}>
                          {category.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-grotesk text-lg font-bold text-foreground text-center group-hover:text-primary transition-colors">
                        {category}
                      </h3>
                      <div className="mt-4 flex justify-center">
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our most popular and high-quality paint selections
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-64 bg-muted rounded-2xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette size={48} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-8">Check back soon for our amazing paint collection</p>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                <Sparkles size={18} />
                Add Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group relative bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Product image */}
                    <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Palette size={64} className="text-muted-foreground" />
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Product details */}
                    <div className="p-6">
                      <h3 className="font-grotesk text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {product.description || "Premium quality paint for your project"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-grotesk text-2xl font-bold text-foreground">
                            ${product.price?.toFixed(2) || "0.00"}
                          </span>
                          {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.colors.length} colors available
                            </p>
                          )}
                        </div>
                        
                        {product.rating && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-foreground">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Hover arrow */}
                      <div className="absolute bottom-6 right-6 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* View all button */}
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 group"
                >
                  <span>View All Products</span>
                  <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Sparkles size={32} className="text-white" />
              </div>
              
              <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Transform</span> Your Space?
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Create a custom paint order tailored to your project needs, 
                or explore our wide range of premium products
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/build-order"
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-3"
                >
                  <span>Build Your Order</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span>→</span>
                  </div>
                </Link>
                
                <Link
                  href="/products"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-primary/30 text-primary rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 inline-flex items-center justify-center gap-3"
                >
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Browse Products
                  </span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/20">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Truck size={24} className="text-primary" />
                  </div>
                  <p className="font-medium">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield size={24} className="text-primary" />
                  </div>
                  <p className="font-medium">Quality Guarantee</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={24} className="text-primary" />
                  </div>
                  <p className="font-medium">Eco-Friendly</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Palette size={24} className="text-primary" />
                  </div>
                  <p className="font-medium">Expert Advice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}