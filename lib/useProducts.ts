import useSWR from "swr"

export function useProducts(category?: string, color?: string) {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (color) params.append("color", color)

  const { data, error, isLoading } = useSWR(`/api/products?${params}`, (url) => fetch(url).then((res) => res.json()))

  return {
    products: data || [],
    isLoading,
    error,
  }
}
