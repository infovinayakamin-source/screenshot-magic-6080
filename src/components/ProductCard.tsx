import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Eye, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR, type Product } from '@/lib/products';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
export function ProductCard({ product, onQuickView, imageFit = 'cover' }: { product: Product; onQuickView?: (product: Product) => void; imageFit?: 'cover' | 'contain' }) {
  const { add, wishlist, toggleWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const soldOut = product.stockStatus === 'out';
  return <article className="catalog-card group">
    <div className="catalog-card-image">
      <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name}><img src={product.images[0]} alt={product.name} width={600} height={600} loading="lazy" decoding="async" className={cn(imageFit === 'contain' ? 'object-contain' : 'object-cover')} /></Link>
      {soldOut && <span className="catalog-stock">Out of stock</span>}
      <Button variant="ghost" size="icon" className="catalog-heart" aria-label={wishlist.includes(product.id) ? `Unsave ${product.name}` : `Save ${product.name}`} onClick={() => toggleWishlist(product.id)}><Heart className={cn(wishlist.includes(product.id) && 'fill-primary')} /></Button>
      <div className="catalog-actions">
        {onQuickView && <Button variant="secondary" size="icon" aria-label={`Quick view ${product.name}`} onClick={() => onQuickView(product)}><Eye /></Button>}
        <Button size="icon" disabled={soldOut} aria-label={`Add ${product.name} to cart`} onClick={() => add(product.id, qty)}><ShoppingBag /></Button>
      </div>
    </div>
    <div className="catalog-card-copy">
      <h3><Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link></h3>
      <p className="catalog-sign">{product.sign} · {product.signHi}</p>
      <p className="catalog-price">{formatINR(product.price)} {product.compareAtPrice && product.compareAtPrice > product.price && <del>{formatINR(product.compareAtPrice)}</del>}</p>
      <div className="catalog-quantity"><Button variant="ghost" size="icon" aria-label={`Decrease ${product.name} quantity`} disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></Button><span aria-live="polite">{qty}</span><Button variant="ghost" size="icon" aria-label={`Increase ${product.name} quantity`} disabled={soldOut || qty >= product.inventory} onClick={() => setQty(qty + 1)}><Plus /></Button></div>
    </div>
  </article>;
}
