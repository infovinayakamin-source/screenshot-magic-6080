import { Link } from '@tanstack/react-router';
import { Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/logo.jpg';
import { BRAND } from '@/lib/products';
import { NewsletterForm } from '@/components/NewsletterForm';
import { storefrontContent } from '@/lib/storefront-content';
export function Footer() {
  return <footer className="reference-footer">
    <div className="shell reference-footer-grid">
      <div className="footer-brand"><img src={logo} alt={`${BRAND} original logo`} width={512} height={512} loading="lazy" /><h2>{BRAND}</h2><p>{storefrontContent.tagline}</p><div className="footer-socials">{storefrontContent.socialLinks.instagram ? <a href={storefrontContent.socialLinks.instagram} aria-label="Instagram" rel="noreferrer" target="_blank"><Instagram /></a> : <span title="Instagram account not supplied"><Instagram /></span>}{storefrontContent.socialLinks.facebook ? <a href={storefrontContent.socialLinks.facebook} aria-label="Facebook" rel="noreferrer" target="_blank"><Facebook /></a> : <span title="Facebook account not supplied"><Facebook /></span>}</div></div>
      <div><h3>Explore</h3><ul><li><Link to="/">Home</Link></li><li><Link to="/shop">Shop All</Link></li><li><Link to="/collections/zodiac-crystal-collection">Zodiac Bracelets</Link></li><li><Link to="/about">About Us</Link></li></ul></div>
      <div><h3>Information</h3><ul><li><Link to="/contact">Contact Us</Link></li><li><Link to="/faq">FAQs & Care</Link></li><li><Link to="/cart">Your Cart</Link></li><li><Link to="/shop" search={{ wishlist: true }}>Wishlist</Link></li><li><Link to="/auth">Admin Sign In</Link></li></ul></div>
      <div><h3>Stay in the Loop</h3><p>Discover new bracelets, stone stories and thoughtful gifting ideas.</p><NewsletterForm /></div>
    </div>
    <div className="shell reference-footer-bottom"><span>© 2026 {BRAND}. All rights reserved.</span><span>Crystal jewellery · Personal meaning</span></div>
  </footer>;
}
