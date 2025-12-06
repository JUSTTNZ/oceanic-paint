import Link from "next/link"
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-2 rounded">
                <span className="font-grotesk text-lg font-bold text-primary-foreground">OP</span>
              </div>
              <span className="font-grotesk font-bold text-foreground">Oceanic Paint</span>
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
                <FaEnvelope size={16} />
                <a href="mailto:info@oceanicpaint.com" className="hover:text-primary transition">
                  info@oceanicpaint.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone size={16} />
                <a href="tel:+1234567890" className="hover:text-primary transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={16} />
                <span>123 Paint Street, Art City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Oceanic Paint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
