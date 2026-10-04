import { Link } from "@tanstack/react-router";
import { Heart, Eye } from "lucide-react";
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
  const buyNow = useBuyNow();
  const wished = wishlist.includes(product.id);
  const off = discountPercent(product);
  const soldOut = product.inventory === 0;

  return (
    <article className="group flex min-w-0 flex-col border border-border bg-background transition-colors hover:border-gold">
      <div className="relative overflow-hidden border-b border-border bg-background">
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
            className={cn("aspect-square w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105", imageFit === "contain" ? "object-contain" : "object-cover")}
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
                SOLD OUT
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

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-display text-lg leading-snug text-ink">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:opacity-70">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-medium text-ink">{formatINR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Button
            variant="quiet"
            className="h-10 min-w-0 px-1 text-[10px] sm:px-3"
            disabled={soldOut}
            onClick={() => {
              add(product.id);
              toast.success(`${product.name} added to cart`);
            }}
          >
            {soldOut ? "Sold out" : "Add to cart"}
          </Button>
          {!soldOut && (
            <Button variant="ink" className="h-10 min-w-0 px-1 text-[10px] sm:px-3" onClick={() => buyNow(product.id)}>
              Buy it now
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
