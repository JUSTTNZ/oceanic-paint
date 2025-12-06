"use client"

import { useState } from "react"
import { FaChevronRight } from "react-icons/fa"

export default function BuildOrderPage() {
  const mockColors = ["Alabaster White", "Ocean Blue", "Sunset Orange", "Forest Green", "Midnight Black", "Sunny Yellow", "Coral Pink", "Sky Gray"]
  const mockSizes = ["1 Gallon", "5 Gallons", "1 Quart", "1 Pint"]
  const [paintType, setPaintType] = useState("Interior")
  const [finish, setFinish] = useState("Matte")
  const [selectedColor, setSelectedColor] = useState(mockColors[0])
  const [selectedSize, setSelectedSize] = useState(mockSizes[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)


  const paintTypes = ["Interior", "Exterior", "Gloss"]
  const finishes = ["Matte", "Gloss", "Semi-Gloss", "Eggshell"]
  const basePrice = 45.99

  const handleAddToCart = () => {
    // Will be implemented later
    console.log("Add to cart clicked");
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-grotesk text-4xl font-bold text-foreground mb-2">Build Your Own Paint Order</h1>
          <p className="text-muted-foreground">Customize the perfect paint for your project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Customization Panel */}
          <div className="space-y-8">
            {/* Paint Type */}
            <div>
              <h3 className="font-grotesk font-bold text-lg text-foreground mb-4">Paint Type</h3>
              <div className="space-y-2">
                {paintTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setPaintType(type)}
                    className={`w-full p-4 rounded border-2 transition text-left font-medium ${
                      paintType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {type} Paint
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div>
              <h3 className="font-grotesk font-bold text-lg text-foreground mb-4">Finish Type</h3>
              <div className="space-y-2">
                {finishes.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`w-full p-4 rounded border-2 transition text-left font-medium ${
                      finish === f
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {f} Finish
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="font-grotesk font-bold text-lg text-foreground mb-4">Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {mockColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`p-3 rounded border-2 transition text-xs font-medium ${
                      selectedColor === color
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="font-grotesk font-bold text-lg text-foreground mb-4">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {mockSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded border-2 transition text-sm font-medium ${
                      selectedSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-grotesk font-bold text-lg text-foreground mb-4">Quantity</h3>
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
          </div>

          {/* Preview and Summary */}
          <div>
            {/* Preview */}
            <div className="bg-gradient-to-b from-primary/10 to-secondary/10 border-2 border-border rounded-lg p-12 mb-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-40 bg-gradient-to-b from-primary/30 to-secondary/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{selectedColor}</p>
                    <p className="font-bold text-foreground">{paintType}</p>
                    <p className="text-xs text-muted-foreground">{finish}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-grotesk font-bold text-xl text-foreground">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paint Type:</span>
                  <span className="text-foreground font-medium">{paintType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Finish:</span>
                  <span className="text-foreground font-medium">{finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="text-foreground font-medium">{selectedColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="text-foreground font-medium">{selectedSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="text-foreground font-medium">{quantity}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-foreground">Unit Price:</span>
                  <span className="font-grotesk font-bold">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-grotesk text-lg font-bold text-foreground">
                  <span>Total:</span>
                  <span>${(basePrice * quantity).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 text-primary-foreground rounded font-bold hover:opacity-90 transition flex items-center justify-center gap-2 ${ added ? 'bg-secondary' : 'bg-primary'}`}
              >
                {added ? 'Added to cart!' : 'Add to Cart'}
                <FaChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
