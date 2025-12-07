import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded">
                <span className="font-grotesk text-lg font-bold text-primary-foreground">EP</span>
              </div>
              <span className="font-grotesk font-bold text-foreground">Evans Paints</span>
            </div>
            <p className="text-muted-foreground text-sm">Premium paint products for every project.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-grotesk font-bold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?category=Interior" className="hover:text-primary transition">
                  Interior Paint
                </Link>
              </li>
              <li>
                <Link href="/products?category=Exterior" className="hover:text-primary transition">
                  Exterior Paint
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gloss" className="hover:text-primary transition">
                  Gloss Finishes
                </Link>
              </li>
              <li>
                <Link href="/build-order" className="hover:text-primary transition">
                  Build Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-grotesk font-bold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-grotesk font-bold text-foreground mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@evanspaints.com" className="hover:text-primary transition">
                  info@evanspaints.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-primary transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Paint Street, Art City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Evans Paints. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
