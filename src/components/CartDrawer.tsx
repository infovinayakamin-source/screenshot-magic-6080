import { Link } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, setQty, remove } = useStore();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-xl">Your cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is still empty.</p>
            <Button variant="ink" onClick={() => setCartOpen(false)} asChild>
              <Link to="/shop">Shop collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-5 py-4">
              <p className="text-xs text-muted-foreground">
                {remaining > 0 ? (
                  <>
                    You&apos;re <span className="text-ink">{formatINR(remaining)}</span> away from free
                    shipping
                  </>
                ) : (
                  <span className="text-ink">You&apos;ve unlocked free shipping.</span>
                )}
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-5">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="size-18 aspect-square w-18 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate font-display text-base text-ink">{product.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="shrink-0 text-muted-foreground hover:text-ink"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{formatINR(product.price)}</p>
                      <div className="mt-2 inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="grid size-8 place-items-center text-ink"
                          onClick={() => setQty(product.id, qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="grid size-8 place-items-center text-ink"
                          onClick={() => setQty(product.id, qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-base text-ink">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Taxes included. Shipping calculated at checkout.
              </p>
              <Button variant="ink" size="xl" className="mt-4 w-full" asChild>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  Checkout
                </Link>
              </Button>
              <Button variant="ghost" className="mt-2 w-full text-xs tracking-[0.14em] uppercase" onClick={() => setCartOpen(false)}>
                Continue shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
