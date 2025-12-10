"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Edit, Trash2, Upload } from "lucide-react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { RootState } from "@/lib/store"
import { formatPrice } from "@/components/formatprice"

export default function ProductsManagementPage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")
  const [rating, setRating] = useState("")
  const [reviews, setReviews] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') router.push("/")
  }, [user, router])

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error(err)
      const errorMsg = "Failed to load products"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAdmin) return null

  // File selection & preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      const msg = "Please select an image file"
      setError(msg)
      toast.error(msg)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      const msg = "File size should be less than 5MB"
      setError(msg)
      toast.error(msg)
      return
    }
    
    setImageFile(file)
    setError("")

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const supabase = createSupabaseBrowserClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      console.error(err)
      return null
    }
  }

  // Add or update product
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setUploading(true)

    if (!name || !price || !category) {
      const msg = "Name, price, and category are required"
      setError(msg)
      toast.error(msg)
      setUploading(false)
      return
    }

    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      const msg = "Please enter a valid price"
      setError(msg)
      toast.error(msg)
      setUploading(false)
      return
    }

    try {
      const supabase = createSupabaseBrowserClient()
      let imageUrl = imagePreview

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile)
        if (!uploadedUrl) {
          setError("Failed to upload image")
          setUploading(false)
          return
        }
        imageUrl = uploadedUrl
      }

      const productData: any = {
        name,
        price: priceNumber,
        category,
        description: description || null,
        image: imageUrl || null,
      }

      if (colors) productData.colors = colors.split(",").map(c => c.trim())
      if (sizes) productData.sizes = sizes.split(",").map(s => s.trim())
      if (rating) productData.rating = parseFloat(rating)
      if (reviews) productData.reviews = parseInt(reviews)

      if (editingProduct) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select()
        if (error) throw error
        setProducts(products.map(p => p.id === editingProduct.id ? data[0] : p))
        toast.success("Product updated successfully!")
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([productData])
          .select()
        if (error) throw error
        setProducts([data[0], ...products])
        toast.success("Product added successfully!")
      }

      resetForm()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.message || "An error occurred"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) {
        toast.error(error.message)
      } else {
        setProducts(products.filter((p) => p.id !== id))
        toast.success("Product deleted successfully!")
      }
    } catch (err) {
      console.error(err)
      const errorMsg = "Failed to delete product"
      toast.error(errorMsg)
      setError(errorMsg)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setName("")
    setPrice("")
    setCategory("")
    setDescription("")
    setColors("")
    setSizes("")
    setRating("")
    setReviews("")
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1">
        <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} /> Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Product Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            <Plus size={18} />
            {editingProduct ? "Edit Product" : "Add Product"}
          </button>
        </div>

        {error && (
          <div className={`p-4 mb-4 rounded text-sm ${
            error.includes("success") ? "bg-green-50 text-green-700 border border-green-200" :
            "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>{error}</div>
        )}

        {showForm && (
          <form onSubmit={handleSubmitProduct} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter product name"
                disabled={uploading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0.01"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                  disabled={uploading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Gloss">Gloss</option>
                  <option value="Matte">Matte</option>
                  <option value="Primer">Primer</option>
                  <option value="Varnish">Varnish</option>
                  <option value="Eco-Friendly">Eco-Friendly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Enter product description"
                disabled={uploading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Colors (comma-separated)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="White, Off-White, Cream"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  placeholder="1L, 5L, 10L"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="4.5"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reviews Count</label>
                <input
                  type="number"
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="100"
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" disabled={uploading} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded text-foreground hover:bg-muted/30 transition w-full"
                disabled={uploading}
              >
                <Upload size={18} />
                {imageFile ? imageFile.name : "Choose an image file"}
              </button>

              {imagePreview && (
                <div className="mt-4 relative w-32 h-32">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded border border-border" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    disabled={uploading}
                  >×</button>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, WebP. Max size: 5MB</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary/5 transition disabled:opacity-50"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Image</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Product Name</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Category</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Price</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No products found. Add your first product!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="py-4 px-6">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">No image</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{product.description}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">{product.category}</span>
                        </td>
                        <td className="py-4 px-6 text-foreground font-bold">{formatPrice(product.price || 0)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-primary hover:text-primary/80 transition"
                              onClick={() => {
                                setEditingProduct(product)
                                setName(product.name)
                                setPrice(product.price.toString())
                                setCategory(product.category)
                                setDescription(product.description || "")
                                setColors(product.colors?.join(", ") || "")
                                setSizes(product.sizes?.join(", ") || "")
                                setRating(product.rating?.toString() || "")
                                setReviews(product.reviews?.toString() || "")
                                setImagePreview(product.image || null)
                                setShowForm(true)
                              }}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-destructive hover:text-destructive/80 transition"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
