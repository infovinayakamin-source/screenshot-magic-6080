import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Aarohi" },
      { name: "description", content: "Review the natural stone jewellery in your Aarohi cart before checkout." },
      { property: "og:title", content: "Your Cart | Aarohi" },
      { property: "og:description", content: "Review your selected pieces before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useStore();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <section className="shell py-14 md:py-20">
      <h1 className="text-4xl text-ink md:text-6xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-sand p-12 text-center">
          <p className="text-sm text-muted-foreground">Your cart is still empty.</p>
          <Button variant="ink" size="xl" className="mt-6" asChild>
            <Link to="/shop">Shop collection</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="flex flex-col divide-y divide-border">
            {items.map(({ product, qty }) => (
              <li key={product.id} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 first:pt-0">
                <Link to="/product/$slug" params={{ slug: product.slug }}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="aspect-square w-22 rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="block truncate font-display text-lg text-ink hover:opacity-70"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{product.stoneType}</p>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="shrink-0 text-muted-foreground hover:text-ink"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="grid size-9 place-items-center"
                        onClick={() => setQty(product.id, qty - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{qty}</span>
                      <button
                        aria-label="Increase quantity"
                        className="grid size-9 place-items-center"
                        onClick={() => setQty(product.id, qty + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-sm text-ink">{formatINR(product.price * qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl bg-sand p-7">
            <p className="eyebrow">Order summary</p>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-ink">{formatINR(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-ink">{remaining > 0 ? "₹99" : "Free"}</span>
            </div>
            <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg text-ink">{formatINR(subtotal + (remaining > 0 ? 99 : 0))}</span>
            </div>
            {remaining > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                You&apos;re {formatINR(remaining)} away from free shipping.
              </p>
            )}
            <Button variant="ink" size="xl" className="mt-6 w-full" asChild>
              <Link to="/checkout">Checkout</Link>
            </Button>
            <Button variant="ghost" className="mt-2 w-full text-xs tracking-[0.14em] uppercase" asChild>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </section>
  );
}
