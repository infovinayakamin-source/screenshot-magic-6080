import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";
import { discountPercent, formatINR, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function QuickView({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { add } = useStore();

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        {product && (
          <div className="grid gap-0 sm:grid-cols-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
            <div className="p-6">
              <DialogTitle className="font-display text-2xl text-ink">{product.name}</DialogTitle>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={product.rating} />
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-lg text-ink">{formatINR(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatINR(product.compareAtPrice)}
                    </span>
                    <span className="text-xs tracking-[0.12em] text-primary uppercase">
                      {discountPercent(product)}% off
                    </span>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
                <dt>Stone</dt>
                <dd className="text-ink">{product.stoneType}</dd>
                <dt>Size</dt>
                <dd className="text-ink">{product.size}</dd>
              </dl>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant="ink"
                  size="xl"
                  disabled={product.inventory === 0}
                  onClick={() => {
                    add(product.id);
                    onOpenChange(false);
                    toast.success(`${product.name} added to cart`);
                  }}
                >
                  {product.inventory === 0 ? "Sold out" : "Add to cart"}
                </Button>
                <Button variant="quiet" size="xl" asChild onClick={() => onOpenChange(false)}>
                  <Link to="/product/$slug" params={{ slug: product.slug }}>
                    View full details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
