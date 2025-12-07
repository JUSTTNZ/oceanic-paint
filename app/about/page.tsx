import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-grotesk text-4xl font-bold mb-4">About Oceanic Paint</h1>
            <p className="text-lg opacity-90">Premium paint solutions for over 20 years</p>
          </div>

          
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
              <h2 className="font-grotesk text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Oceanic Paint has been dedicated to providing high-quality paint products since 2004. We started as a
                small local business and have grown to serve thousands of customers nationwide. Our commitment to
                quality, innovation, and customer satisfaction remains unwavering.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide premium, sustainable paint products that help our customers transform their spaces
                beautifully and responsibly. We believe that quality paint shouldn't be a luxury—it should be accessible
                to everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-grotesk font-bold text-lg text-foreground mb-2">Quality</h3>
                <p className="text-muted-foreground text-sm">
                  All our products meet the highest industry standards and are tested for durability and color accuracy.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-grotesk font-bold text-lg text-foreground mb-2">Sustainability</h3>
                <p className="text-muted-foreground text-sm">
                  We're committed to environmentally responsible manufacturing and packaging solutions.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-grotesk font-bold text-lg text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Constantly developing new colors and finishes to meet modern design trends.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition"
              >
                Shop Our Products
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
