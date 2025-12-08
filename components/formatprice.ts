export function formatPrice(amount: number) {
  // Format as Naira with commas
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}
