"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Star, ShoppingCart, ChevronLeft } from "lucide-react"
import { useDispatch } from "react-redux"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { addToCart } from "@/lib/cartSlice"
import type { AppDispatch } from "@/lib/store"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatPrice } from "@/components/formatprice"

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id as string
  
  const dispatch = useDispatch<AppDispatch>()
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (productId) fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()
      
      if (error) throw error
      
      setProduct(data)
      
      if (data?.sizes?.length) setSelectedSize(data.sizes[0])
      if (data?.colors?.length) setSelectedColor(data.colors[0])
    } catch (err) {
      console.error("Error fetching product:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
        image: product.image,
      })
    )
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
            <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
              Back to products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />

      {/* Full-width content with responsive padding */}
      <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1">
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ChevronLeft size={18} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden h-96">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-sm sm:text-base text-primary font-medium mb-2">{product.category}</p>
            <h1 className="font-grotesk font-bold text-[clamp(1.5rem,5vw,2.5rem)] text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
       
            {/* Price */}
            <div className="mb-6">
              <span className="font-grotesk text-[clamp(1.5rem,5vw,2rem)] font-bold text-foreground">
                {formatPrice(product.price || 0)}

              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[clamp(0.875rem,3vw,1rem)] text-muted-foreground mb-6">{product.description}</p>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-4">
                <label className="block font-grotesk font-bold text-foreground mb-2">Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`p-2 rounded border-2 transition text-sm font-medium ${
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary text-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="block font-grotesk font-bold text-foreground mb-2">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2 rounded border-2 transition text-sm font-medium ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border hover:border-primary text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <label className="block font-grotesk font-bold text-foreground mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-border rounded hover:bg-muted transition"
                >
                  −
                </button>
                <span className="text-foreground font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-border rounded hover:bg-muted transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product}
              className={`w-full py-3 rounded font-bold text-lg flex items-center justify-center gap-2 transition ${
                addedToCart
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>

            {/* Build Your Own */}
            <Link
              href="/build-order"
              className="w-full mt-3 py-3 border-2 border-primary text-primary rounded font-bold text-lg text-center hover:bg-primary/5 transition block"
            >
              Build Your Own
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
