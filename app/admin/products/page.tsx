"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FaChevronLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { mockPaints } from "@/lib/mockData"
import type { RootState } from "@/lib/store"

export default function ProductsManagementPage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const [products, setProducts] = useState(mockPaints)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
    }
  }, [user, router])

  if (!user?.isAdmin) {
    return null
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && price && category) {
      setProducts([
        ...products,
        {
          id: Math.random().toString(),
          name,
          price: Number.parseFloat(price),
          category,
          image: "/paint-bucket.jpg",
          description: "New paint product",
          colors: ["Color 1", "Color 2"],
          sizes: ["1L", "5L", "10L"],
          rating: 0,
          reviews: 0,
        },
      ])
      setName("")
      setPrice("")
      setCategory("")
      setShowForm(false)
    }
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <FaChevronLeft size={18} />
          Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Product Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
          >
            <FaPlus size={18} />
            Add Product
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <form onSubmit={handleAddProduct} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Gloss">Gloss</option>
                  <option value="Matte">Matte</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary/5 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Products Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Product Name</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Category</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Price</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Rating</th>
                  <th className="text-left py-4 px-6 font-bold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-6 text-foreground font-medium">{product.name}</td>
                    <td className="py-4 px-6 text-foreground">{product.category}</td>
                    <td className="py-4 px-6 text-foreground font-bold">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-foreground">{product.rating}★</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button className="text-primary hover:text-primary/80 transition">
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive/80 transition"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
