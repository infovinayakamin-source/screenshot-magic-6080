import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand/60">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="max-w-xs">
          <p className="font-display text-2xl tracking-[0.14em] text-ink">{BRAND}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Natural stone jewellery made for everyday style, personal intention and meaningful gifting.
          </p>
        </div>

        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-ink">All Products</Link></li>
            <li><Link to="/shop" search={{ category: "Bracelets" }} className="hover:text-ink">Bracelets</Link></li>
            <li><Link to="/shop" search={{ category: "Pendants" }} className="hover:text-ink">Pendants</Link></li>
            <li><Link to="/collections" className="hover:text-ink">Collections</Link></li>
            <li><Link to="/shop" search={{ sort: "best" }} className="hover:text-ink">Bestsellers</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Help</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-ink">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-ink">FAQ</Link></li>
            <li><Link to="/faq" hash="shipping" className="hover:text-ink">Shipping</Link></li>
            <li><Link to="/faq" hash="returns" className="hover:text-ink">Returns</Link></li>
            <li><Link to="/faq" hash="privacy" className="hover:text-ink">Privacy Policy</Link></li>
            <li><Link to="/faq" hash="terms" className="hover:text-ink">Terms</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Follow</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <Instagram className="size-4" /> Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <Facebook className="size-4" /> Facebook
              </a>
            </li>
            <li>
              <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {BRAND}. All rights reserved.</p>
          <p>Crafted with intention in India.</p>
        </div>
      </div>
    </footer>
  );
}
