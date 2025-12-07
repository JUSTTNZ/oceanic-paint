"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, ChevronLeft } from "lucide-react"
import { useDispatch } from "react-redux"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { mockPaints } from "@/lib/mockData"
import { addToCart } from "@/lib/cartSlice"
import type { AppDispatch } from "@/lib/store"

export default function ProductDetail({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const paint = mockPaints.find((p) => p.id === params.id)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(paint?.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(paint?.colors[0] || "")
  const [addedToCart, setAddedToCart] = useState(false)

  if (!paint) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
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

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: paint.id,
        name: paint.name,
        price: paint.price,
        quantity,
        size: selectedSize,
        color: selectedColor,
        image: paint.image,
      }),
    )
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden h-96">
            <Image
              src={paint.image || "/placeholder.svg"}
              alt={paint.name}
              width={400}
              height={400}
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <p className="text-sm text-primary font-medium mb-2">{paint.category}</p>
            <h1 className="font-grotesk text-4xl font-bold text-foreground mb-4">{paint.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(paint.rating) ? "text-secondary fill-secondary" : "text-muted"}
                  />
                ))}
              </div>
              <span className="text-foreground font-medium">{paint.rating}</span>
              <span className="text-muted-foreground text-sm">({paint.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="font-grotesk text-4xl font-bold text-foreground">${paint.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8">{paint.description}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block font-grotesk font-bold text-foreground mb-3">Color</label>
              <div className="grid grid-cols-3 gap-2">
                {paint.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`p-3 rounded border-2 transition text-sm font-medium ${
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

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block font-grotesk font-bold text-foreground mb-3">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {paint.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded border-2 transition text-sm font-medium ${
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

            {/* Quantity Selection */}
            <div className="mb-8">
              <label className="block font-grotesk font-bold text-foreground mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-border rounded hover:bg-muted transition"
                >
                  −
                </button>
                <span className="text-foreground font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-border rounded hover:bg-muted transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded font-bold text-lg flex items-center justify-center gap-2 transition ${
                addedToCart
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>

            {/* Build Your Own */}
            <Link
              href="/build-order"
              className="w-full mt-4 py-4 border-2 border-primary text-primary rounded font-bold text-lg text-center hover:bg-primary/5 transition block"
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
