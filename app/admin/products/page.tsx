"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Edit, Trash2, Upload } from "lucide-react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { RootState } from "@/lib/store"

export const mockPaints = [
  {
    id: "1",
    name: "Premium Interior White",
    category: "Interior",
    price: 45.99,
    image: "/white-paint-bucket.jpg",
    description: "High-quality interior paint with excellent coverage and durability.",
    colors: ["White", "Off-White", "Cream"],
    sizes: ["1L", "5L", "10L", "20L"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Exterior Weather Guard",
    category: "Exterior",
    price: 62.5,
    image: "/blue-paint-bucket.jpg",
    description: "Weatherproof exterior paint with UV protection and fade resistance.",
    colors: ["Deep Blue", "Forest Green", "Charcoal Gray"],
    sizes: ["1L", "5L", "10L", "20L"],
    rating: 4.6,
    reviews: 98,
  },
  {
    id: "3",
    name: "Glossy Finish Premium",
    category: "Gloss",
    price: 55.99,
    image: "/red-gloss-paint.jpg",
    description: "Premium gloss finish paint for a shiny, elegant look.",
    colors: ["Red", "Black", "Silver"],
    sizes: ["1L", "5L", "10L"],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Matte Elegance",
    category: "Interior",
    price: 48.99,
    image: "/green-matte-paint.jpg",
    description: "Sophisticated matte finish for a modern aesthetic.",
    colors: ["Forest Green", "Olive", "Sage"],
    sizes: ["1L", "5L", "10L", "20L"],
    rating: 4.5,
    reviews: 87,
  },
  {
    id: "5",
    name: "Semi-Gloss Durability",
    category: "Gloss",
    price: 52.99,
    image: "/yellow-paint-bucket.jpg",
    description: "Semi-gloss paint ideal for kitchens and bathrooms.",
    colors: ["Sunny Yellow", "Soft Peach", "Coral Pink"],
    sizes: ["1L", "5L", "10L"],
    rating: 4.6,
    reviews: 112,
  },
  {
    id: "6",
    name: "Eco-Friendly Green",
    category: "Interior",
    price: 59.99,
    image: "/eco-friendly-paint.jpg",
    description: "Environmentally conscious paint with low VOC formula.",
    colors: ["Nature Green", "Earth Brown", "Sky Blue"],
    sizes: ["1L", "5L", "10L", "20L"],
    rating: 4.9,
    reviews: 203,
  },
]

export default function ProductsManagementPage() {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)
  const supabase = createSupabaseBrowserClient()
  
  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
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

  useEffect(() => {
    console.log("User role check:", user?.role)
    if (user?.role !== 'admin') {
      console.log("User not admin, redirecting...")
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    console.log("Fetching products on mount")
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log("Starting fetchProducts...")
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error fetching products from Supabase:", error)
        throw error
      }
      
      console.log("Fetched products:", data)
      setProducts(data || [])
    } catch (err) {
      console.error("Error in fetchProducts:", err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAdmin) {
    console.log("User is not admin, rendering null")
    return null
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (file) {
       // Check file type
       if (!file.type.startsWith('image/')) {
         setError("Please select an image file")
         return
       }
       
       // Check file size (max 5MB)
       if (file.size > 5 * 1024 * 1024) {
         setError("File size should be less than 5MB")
         return
       }
       
       setImageFile(file)
       setError("")
       
       // Create preview
       const reader = new FileReader()
       reader.onloadend = () => {
         setImagePreview(reader.result as string)
       }
       reader.readAsDataURL(file)
     }
   }
 
   // Upload image to Supabase Storage
   const uploadImage = async (file: File): Promise<string | null> => {
     try {
       const fileExt = file.name.split('.').pop()
       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
       const filePath = `products/${fileName}`
       
       const { data, error } = await supabase.storage
         .from('products')
         .upload(filePath, file, {
           cacheControl: '3600',
           upsert: false
         })
       
       if (error) throw error
       
       // Get public URL
       const { data: { publicUrl } } = supabase.storage
         .from('products')
         .getPublicUrl(filePath)
       
       return publicUrl
     } catch (err) {
       console.error("Upload error:", err)
       return null
     }
   }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handleAddProduct triggered")
    setError("")
    setUploading(true)
    
    // Validate required fields
    if (!name || !price || !category) {
      console.error("Validation failed: missing required fields")
      setError("Name, price, and category are required")
      setUploading(false)
      return
    }

    // Convert price to number
    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      console.error("Validation failed: invalid price")
      setError("Please enter a valid price")
      setUploading(false)
      return
    }

    try {
      let imageUrl = null
      
      // Upload image if selected
      if (imageFile) {
        console.log("Image file selected, uploading...")
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          console.error("Image upload failed")
          setError("Failed to upload image. Please try again.")
          setUploading(false)
          return
        }
        console.log("Image uploaded successfully, URL:", imageUrl)
      } else {
        console.log("No image file selected")
      }

      console.log("Preparing product data for database insert...")
      
      // Prepare product data
      const productData: any = {
        name,
        price: priceNumber,
        category,
        description: description || null,
      }

      // Add image URL if available
      if (imageUrl) {
        productData.image = imageUrl
      }

      // Parse colors and sizes from comma-separated strings
      if (colors) {
        const colorsArray = colors.split(',').map(c => c.trim()).filter(c => c)
        if (colorsArray.length > 0) {
          productData.colors = colorsArray
        }
      }

      if (sizes) {
        const sizesArray = sizes.split(',').map(s => s.trim()).filter(s => s)
        if (sizesArray.length > 0) {
          productData.sizes = sizesArray
        }
      }

      // Parse rating and reviews if provided
      if (rating) {
        const ratingNumber = parseFloat(rating)
        if (!isNaN(ratingNumber)) {
          productData.rating = ratingNumber
        }
      }

      if (reviews) {
        const reviewsNumber = parseInt(reviews)
        if (!isNaN(reviewsNumber)) {
          productData.reviews = reviewsNumber
        }
      }

      console.log("Product data to insert:", productData)
      
      // Insert product into database
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
      
      console.log("Database insert result:", { data, error })
      
      if (error) {
        console.error("Supabase insert error:", error)
        setError(`Failed to add product: ${error.message}`)
      } else if (data && data.length > 0) {
        console.log("Product added successfully:", data[0])
        setProducts([data[0], ...products]) // Add new product at the beginning
        
        // Reset form
        console.log("Resetting form...")
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
        setShowForm(false)
        setError("") // Clear any errors
        
        console.log("Product added successfully!")
      }
    } catch (err) {
      console.error("Unexpected error in handleAddProduct:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    console.log("Delete triggered for product ID:", id)
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }
    
    try {
      console.log("Deleting product from database...")
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) {
        console.error("Delete error:", error)
        setError(error.message)
      } else {
        console.log("Product deleted successfully")
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error("Unexpected delete error:", err)
      setError("Failed to delete product")
    }
  }



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} />
          Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-grotesk text-3xl font-bold text-foreground">Product Management</h1>
          <div className="flex gap-3">
      
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className={`p-4 mb-4 rounded text-sm ${
            error.includes("success") 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {error}
          </div>
        )}

        {/* Add Product Form */}
        {showForm && (
          <form onSubmit={handleAddProduct} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="Enter product name"
                disabled={uploading}
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
                  required
                  placeholder="0.00"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={uploading}
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
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="White, Off-White, Cream"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1L, 5L, 10L"
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
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Product Image</label>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                disabled={uploading}
              />
              
              {/* Upload button */}
              <button
                type="button"
                onClick={() => {
                  console.log("File input button clicked")
                  fileInputRef.current?.click()
                }}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded text-foreground hover:bg-muted/30 transition w-full"
                disabled={uploading}
              >
                <Upload size={18} />
                {imageFile ? imageFile.name : "Choose an image file"}
              </button>
              
              {/* Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="relative w-32 h-32">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Removing image preview")
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      disabled={uploading}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: JPG, PNG, WebP. Max size: 5MB
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("Canceling form")
                  setShowForm(false)
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
                }}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded font-bold hover:bg-primary/5 transition disabled:opacity-50"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          /* Products Table */
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Image</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Product Name</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Category</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Price</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Rating</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Reviews</th>
                    <th className="text-left py-4 px-6 font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No products found. Add your first product!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="py-4 px-6">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                console.error("Image failed to load:", product.image)
                                e.currentTarget.src = "/placeholder-image.jpg"
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">No image</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </p>
                            {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.colors.slice(0, 3).map((color: string, index: number) => (
                                  <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                                    {color}
                                  </span>
                                ))}
                                {product.colors.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{product.colors.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-foreground font-bold">${product.price?.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <span className="text-foreground font-medium">{product.rating || 'N/A'}</span>
                            {product.rating && <span className="text-yellow-500">★</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">{product.reviews || 0} reviews</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button 
                              className="text-primary hover:text-primary/80 transition"
                              onClick={() => {
                                console.log("Edit product:", product.id)
                                // TODO: Implement edit functionality
                              }}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive hover:text-destructive/80 transition"
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