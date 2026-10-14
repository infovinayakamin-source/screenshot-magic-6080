import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Eye, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { discountPercent, formatINR, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useBuyNow } from "@/lib/use-buy-now";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  onQuickView,
  imageFit = "cover",
}: {
  product: Product;
  onQuickView?: (p: Product) => void;
  imageFit?: "cover" | "contain";
}) {
  const { add, wishlist, toggleWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const buyNow = useBuyNow();
  const wished = wishlist.includes(product.id);
  const off = discountPercent(product);
  const soldOut = product.stockStatus === "out";
  const maxQty = Math.max(1, product.inventory);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden bg-transparent transition-all duration-300">
      <div className="relative overflow-hidden border border-border/50 bg-background">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={product.name}
          className="block"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={1200}
            height={1200}
            className={cn("aspect-square w-full p-3 transition-transform duration-500 group-hover:scale-[1.03]", imageFit === "contain" ? "object-contain" : "object-cover")}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5 sm:p-3">
          <div className="flex flex-col gap-1.5">
            {off > 0 && (
              <span className="pointer-events-auto border border-gold bg-background/95 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-navy">
                {off}% OFF
              </span>
            )}
            {soldOut && (
              <span className="pointer-events-auto border border-gold bg-navy px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-gold">
                OUT OF STOCK
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleWishlist(product.id);
              toast(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="pointer-events-auto size-8 shrink-0 rounded-full bg-background/90 text-ink backdrop-blur transition-colors hover:bg-background"
          >
            <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
          </Button>
        </div>

        {onQuickView && (
          <div className="absolute inset-x-2 bottom-2 transition-all duration-300 md:inset-x-2.5 md:bottom-2.5 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
            <Button
              variant="ink"
              className="h-9 w-full gap-1 px-2 text-[10px] sm:h-10 sm:gap-2 sm:text-xs"
              onClick={() => onQuickView(product)}
            >
              <Eye /> Quick View
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-2 pt-4">
        <p className="mb-2 text-[10px] font-bold uppercase text-navy sm:text-xs"><span className="text-gold">{product.symbol}</span> {product.sign} · {product.signHi}</p>
        <h3 className="font-display text-xl leading-snug text-ink sm:text-2xl">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:opacity-70">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{product.stones || product.shortDescription}</p>
        <p className={cn("mt-2 text-[11px] font-medium", soldOut ? "text-destructive" : "text-navy")}>{soldOut ? "Out of stock" : product.stockStatus === "low" ? "Only a few left" : "In stock"}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <div className="inline-flex h-9 items-center rounded-full border border-border sm:h-10">
            <Button variant="ghost" size="icon" className="size-8 rounded-full sm:size-9" aria-label={`Decrease ${product.name} quantity`} onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="size-3" /></Button>
            <span className="w-5 text-center text-sm text-ink" aria-live="polite">{qty}</span>
            <Button variant="ghost" size="icon" className="size-8 rounded-full sm:size-9" aria-label={`Increase ${product.name} quantity`} disabled={soldOut || qty >= maxQty} onClick={() => setQty(Math.min(maxQty, qty + 1))}><Plus className="size-3" /></Button>
          </div>
          <span className="text-lg font-bold text-navy sm:text-xl">{formatINR(product.price * qty)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="grid gap-2 pt-3">
          <Button
            variant="ink"
            className="h-10 w-full rounded-none px-2 text-[10px] sm:h-11 sm:text-xs"
            disabled={soldOut}
            onClick={() => {
              add(product.id, qty);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag className="size-4" /> {soldOut ? "Out of stock" : "Add to cart"}
          </Button>
          {!soldOut && (
            <Button variant="quiet" className="h-9 w-full rounded-none px-2 text-[10px] sm:text-xs" onClick={() => buyNow(product.id, qty)}>
              Buy it now
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
