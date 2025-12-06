"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaStar } from "react-icons/fa"

export default function ProductsClient({ initialProducts, categories, colors }: { initialProducts: any[], categories: string[], colors: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("featured")

    const filteredProducts = useMemo(() => {
        let filtered = initialProducts

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category === selectedCategory)
        }

        // Color filter is not implemented in the data model yet
        // if (selectedColor) {
        //     filtered = filtered.filter((p) => p.colors.includes(selectedColor))
        // }

        if (sortBy === "price-low") {
            filtered = [...filtered].sort((a, b) => a.price - b.price)
        } else if (sortBy === "price-high") {
            filtered = [...filtered].sort((a, b) => b.price - a.price)
        } 
        // Rating filter is not implemented in the data model yet
        // else if (sortBy === "rating") {
        //     filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        // }

        return filtered
    }, [selectedCategory, selectedColor, sortBy, initialProducts])

    return (
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
                                className={`w-full text-left px-4 py-2 rounded transition ${selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                                    }`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-4 py-2 rounded transition ${selectedCategory === cat
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-foreground"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Filter (Not implemented yet) */}
                    {/* <div>
                        <h3 className="font-grotesk font-bold text-foreground mb-4">Color</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedColor("")}
                                className={`w-full text-left px-4 py-2 rounded transition ${selectedColor === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                                    }`}
                            >
                                All Colors
                            </button>
                            {colors.slice(0, 5).map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-full text-left px-4 py-2 rounded transition ${selectedColor === color
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-foreground"
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div> */}

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
                            {/* <option value="rating">Highest Rated</option> */}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((paint) => (
                            <Link
                                key={paint.id}
                                href={`/products/${paint.id}`}
                                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
                            >
                                <div className="relative h-48 bg-muted overflow-hidden">
                                    <Image
                                        src={paint.image_url || "/placeholder.svg"}
                                        alt={paint.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition"
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-primary font-medium mb-1">{paint.category}</p>
                                    <h3 className="font-grotesk font-bold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                                        {paint.name}
                                    </h3>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-grotesk font-bold text-lg text-foreground">
                                            ${paint.price.toFixed(2)}
                                        </span>
                                        {/* <div className="flex items-center gap-1">
                                            <FaStar size={14} className="text-secondary fill-secondary" />
                                            <span className="text-xs text-foreground">{paint.rating}</span>
                                        </div> */}
                                    </div>
                                    {/* <p className="text-xs text-muted-foreground line-clamp-1">{paint.colors.join(", ")}</p> */}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
