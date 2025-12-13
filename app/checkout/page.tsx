"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Check, Loader2 } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { formatPrice } from "@/components/formatprice"

// Declare PaystackPop type
interface PaystackPopType {
  setup: (options: {
    key: string | undefined;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata?: Record<string, any>;
    callback: (response: { reference: string }) => void;
    onClose: () => void;
  }) => { openIframe: () => void };
}

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("Nigeria")
  const [phone, setPhone] = useState("")

  const cartItems = useSelector((state: RootState) => state.cart.items)
  const user = useSelector((state: RootState) => state.auth.user)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const steps = [
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ]

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Generate unique reference
  function generateReference() {
    return "order_" + Math.random().toString(36).substr(2, 9) + Date.now()
  }

  const handleContinue = () => {
    if (step === "shipping") setStep("payment")
    else if (step === "payment") setStep("review")
  }

  const onPaymentSuccess = async (reference: string) => {
    console.log("Payment successful:", reference)
    alert("Payment successful! Order ID: " + reference)
    // You can redirect to success page or update order status
    // window.location.href = `/orders/success?ref=${reference}`
  }

  const onPaymentClose = () => {
    console.log("Payment popup closed")
    setLoading(false)
  }

  const payWithPaystack = (orderRef: string, orderId: string) => {
  const paystackPop = (window as { PaystackPop?: PaystackPopType }).PaystackPop

  // Verify Paystack loaded
  if (!paystackPop) {
    console.error("PaystackPop is not available")
    alert("Paystack SDK failed to load. Please refresh and try again.")
    setLoading(false)
    return
  }

  // Verify key is set
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY
  console.log('Paystack Key Check:', publicKey ? `${publicKey.substring(0, 7)}...` : 'NOT SET')
  
  if (!publicKey) {
    console.error("Paystack public key is not set")
    alert("Payment configuration error. Please contact support.")
    setLoading(false)
    return
  }

  // Verify key format
  if (!publicKey.startsWith('pk_')) {
    console.error("Invalid Paystack key format - must start with pk_")
    alert("Invalid payment configuration. Please contact support.")
    setLoading(false)
    return
  }

  console.log('Initializing payment with:', {
    email: user?.email || email,
    amount: Math.round(total * 100),
    currency: 'NGN',
    ref: orderRef,
    orderId: orderId
  })

  const handler = paystackPop.setup({
    key: publicKey,
    email: user?.email || email,
    amount: Math.round(total * 100),
    currency: "NGN",
    ref: orderRef,
    metadata: {
      order_id: orderId,
      customer_name: `${firstName} ${lastName}`,
      phone_number: phone
    },
    callback: function (response: { reference: string }) {
      console.log('Payment successful:', response)
      onPaymentSuccess(response.reference)
    },
    onClose: function () {
      console.log('Payment popup closed')
      onPaymentClose()
    },
  })

  handler.openIframe()
}

  const handlePayment = async () => {
    if (!user && !email) {
      alert("Please provide an email address")
      return
    }

    setLoading(true)

    try {
      // Create order in your backend
      const orderData = {
        cartItems: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color || "",
          size: item.size || ""
        })),
        totalAmount: total,
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          zipCode,
          country,
          email: user?.email || email,
          phone
        },
        paymentMethod: "paystack",
        status: "pending"
      }

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const order = await orderResponse.json()
      const orderReference = generateReference()

      // Open Paystack payment popup directly
      payWithPaystack(orderReference, order.order.id)

    } catch (error) {
      console.error("Payment error:", error)
      setLoading(false)
      alert(`Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="px-4 sm:px-6 lg:px-12 py-8 flex-1">
        <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ChevronLeft size={18} />
          Back to Cart
        </Link>

        {/* Step Indicator */}
        <div className="flex gap-4 mb-12">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : idx < steps.findIndex((st) => st.id === step)
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {idx < steps.findIndex((st) => st.id === step) ? <Check size={20} /> : idx + 1}
              </div>
              <span className="font-medium text-foreground hidden sm:inline">{s.label}</span>
              {idx < steps.length - 1 && <div className="h-1 flex-1 bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">

              {/* SHIPPING STEP */}
              {step === "shipping" && (
                <div>
                  <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Shipping Address</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                        Address *
                      </label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-foreground mb-2">
                          Zip Code
                        </label>
                        <input
                          id="zipCode"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                        required
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT STEP */}
              {step === "payment" && (
                <div>
                  <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Payment Method</h2>

                  <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">P</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Paystack</h3>
                        <p className="text-sm text-muted-foreground">Secure payment processing</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      Click "Pay Now" to complete your payment securely with Paystack.
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="text-green-600" />
                        <span>Secure SSL encryption</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="text-green-600" />
                        <span>Card, Bank Transfer, USSD supported</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="text-green-600" />
                        <span>Instant payment confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEW STEP */}
              {step === "review" && (
                <div>
                  <h2 className="font-grotesk text-2xl font-bold text-foreground mb-6">Review Your Order</h2>

                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded">
                      <h3 className="font-bold mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {firstName} {lastName}
                        <br />
                        {email}
                        <br />
                        {phone}
                        <br />
                        {address}
                        <br />
                        {city}, {zipCode}
                        <br />
                        {country}
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded">
                      <h3 className="font-bold mb-3">Payment Method</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 bg-green-600 rounded"></div>
                        <span className="text-sm font-medium">Paystack</span>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded">
                      <h3 className="font-bold mb-3">Order Items</h3>

                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm text-foreground">
                            <span>
                              {item.name} x{item.quantity}
                              {item.color && <span className="text-muted-foreground"> • {item.color}</span>}
                              {item.size && <span className="text-muted-foreground"> • {item.size}</span>}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-4 mt-8">
                {step !== "shipping" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === "payment") setStep("shipping")
                      else if (step === "review") setStep("payment")
                    }}
                    className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded font-bold hover:bg-primary/5 transition"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}

                {step === "review" ? (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={
                      step === "shipping" &&
                      (!firstName || !lastName || !email || !phone || !address || !city)
                    }
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition disabled:opacity-50"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 bg-card sticky top-20">
              <h2 className="font-grotesk font-bold text-xl text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-foreground">
                    <span className="truncate max-w-[120px]">
                      {item.name} ({item.quantity}x)
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-grotesk font-bold text-lg pt-4 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}