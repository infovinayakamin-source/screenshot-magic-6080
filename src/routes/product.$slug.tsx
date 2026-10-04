import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Check, MessageCircle, Ruler, Truck, Gem, Gift } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/ProductGallery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { discountPercent, formatINR, getProduct, products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useBuyNow } from "@/lib/use-buy-now";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found | ShivAmrit Healers" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `${product.name} | ShivAmrit Healers`;
    return {
      meta: [
        { title },
        { name: "description", content: product.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: product.shortDescription },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

const styleTips = [
  {
    title: "Everyday minimal",
    copy: "Wear it alone against linen or cotton for a quiet, understated finish.",
  },
  {
    title: "Layered stack",
    copy: "Pair with a fine chain bracelet or a slim watch for soft contrast.",
  },
  {
    title: "Evening accent",
    copy: "Let the stone be the only colour against a neutral outfit.",
  },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, wishlist, toggleWishlist, markViewed, recentlyViewed } = useStore();
  const buyNow = useBuyNow();
  const [qty, setQty] = useState(1);
  const wished = wishlist.includes(product.id);
  const off = discountPercent(product);
  const soldOut = product.inventory === 0;
  const isBracelet = product.category === "Bracelets";
  const isZodiac = product.collection.includes("zodiac-crystal-collection");

  useEffect(() => {
    setQty(1);
    markViewed(product.id);
  }, [product.id, markViewed]);

  const related = products.filter(
    (p) => p.id !== product.id && p.collection.some((c) => product.collection.includes(c)),
  ).slice(0, 3);
  const bundle = products.filter((p) => p.id !== product.id).slice(0, 2);
  const bundleTotal = [product, ...bundle].reduce((s, p) => s + p.price, 0);
  const viewed = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3) as typeof products;

  const addToCart = () => {
    add(product.id, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <div className="shell pt-6">
        <nav className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span className="px-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="shell grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <ProductGallery productId={product.id} images={product.images} name={product.name} />

        <div>
          <h1 className="text-3xl leading-tight text-ink md:text-5xl">{product.name}</h1>
          {isZodiac && <p className="mt-2 text-xs tracking-[0.14em] text-primary uppercase">Zodiac Crystal Collection</p>}

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl text-ink">{formatINR(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] tracking-[0.12em] text-gold uppercase">
                  {off}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6 space-y-3 border-y border-border py-5 text-sm text-ink">
            <p className="flex items-start gap-3"><Gem className="size-4 shrink-0 text-gold" /> Natural stone colours, each piece with its own variation</p>
            <p className="flex items-start gap-3"><Heart className="size-4 shrink-0 text-gold" /> {isZodiac ? "A personal piece inspired by your zodiac sign" : "A meaningful accessory for everyday wear"}</p>
            <p className="flex items-start gap-3"><Gift className="size-4 shrink-0 text-gold" /> A thoughtful gifting choice</p>
          </div>

          <dl className="mt-6 grid max-w-md grid-cols-[110px_minmax(0,1fr)] gap-y-2 text-sm">
            <dt className="text-muted-foreground">Stone</dt>
            <dd className="text-ink">{product.stoneType}</dd>
            <dt className="text-muted-foreground">Size</dt>
            <dd className="text-ink">{product.size}</dd>
          </dl>

          {isBracelet && <div className="mt-5 border border-border p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-navy"><Ruler className="size-4 text-gold" /> Available size</p>
            <p className="mt-1 text-sm text-ink">{product.size}</p>
            <p className="mt-1 text-xs text-muted-foreground">One size currently listed. See the sizing guide before ordering.</p>
            <Link to="/faq" hash="size" className="mt-2 inline-block text-xs text-primary underline underline-offset-4">Sizing guide</Link>
          </div>}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-navy">
            <span className="flex items-center gap-1.5"><Check className="size-4 text-gold" />{soldOut ? "Sold out" : "In stock"}</span>
            <span className="flex items-center gap-1.5"><Truck className="size-4 text-gold" />Dispatch in 1–2 business days</span>
            <span className="flex items-center gap-1.5"><Check className="size-4 text-gold" />Cash on delivery available</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-border">
              <Button variant="ghost"
                type="button"
                aria-label="Decrease quantity"
                className="grid size-11 place-items-center text-ink"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <Button variant="ghost"
                type="button"
                aria-label="Increase quantity"
                className="grid size-11 place-items-center text-ink"
                onClick={() => setQty(qty + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button variant="ghost"
              type="button"
              onClick={() => {
                toggleWishlist(product.id);
                toast(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Add to wishlist"
              className="grid size-11 place-items-center rounded-md border border-border text-ink"
            >
              <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button variant="ink" size="xl" className="flex-1" disabled={soldOut} onClick={addToCart}>
              {soldOut ? "Sold out" : "Add to cart"}
            </Button>
            <Button
              variant="quiet"
              size="xl"
              className="flex-1 border-gold bg-gold text-gold-foreground hover:bg-gold/85"
              disabled={soldOut}
              onClick={() => buyNow(product.id, qty)}
            >
              Buy it now
            </Button>
          </div>

          <Link to="/contact" className="mt-4 inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4"><MessageCircle className="size-4" /> Ask about this piece</Link>

          <div className="mt-9 bg-navy p-6 text-navy-foreground">
            <p className="text-xs tracking-[0.16em] text-gold uppercase">Meaning & symbolism</p>
            <h2 className="mt-3 text-2xl text-gold">A personal reminder</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-foreground/85">{isZodiac ? "Your zodiac sign can be a reminder of the qualities and intentions that matter to you. Choose this bracelet for its colours and the meaning you give it." : "Natural stones and symbolic designs can be part of a personal ritual or simply a beautiful everyday accessory."}</p>
            <p className="mt-3 text-xs text-navy-foreground/70">Traditional symbolism is personal and is not a medical or guaranteed outcome.</p>
          </div>

          <Accordion type="single" collapsible className="mt-8" defaultValue="details">
            <AccordionItem value="details">
              <AccordionTrigger className="text-xs tracking-[0.16em] uppercase">
                Product details
              </AccordionTrigger>
              <AccordionContent>
                <dl className="grid grid-cols-[130px_minmax(0,1fr)] gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="text-ink">Natural stone · gold-tone alloy</dd>
                  <dt className="text-muted-foreground">Stone type</dt>
                  <dd className="text-ink">{product.stoneType}</dd>
                  <dt className="text-muted-foreground">Approx. size</dt>
                  <dd className="text-ink">{product.size}</dd>
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="text-ink">{product.weight}</dd>
                  <dt className="text-muted-foreground">Colour</dt>
                  <dd className="text-ink">{product.color}</dd>
                  <dt className="text-muted-foreground">Care</dt>
                  <dd className="text-ink">
                    Keep away from water and perfume. Store in the pouch provided and wipe with a soft
                    cloth.
                  </dd>
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="style">
              <AccordionTrigger className="text-xs tracking-[0.16em] uppercase">
                How to style
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-4">
                  {styleTips.map((t) => (
                    <li key={t.title}>
                      <p className="font-display text-lg text-ink">{t.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{t.copy}</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="included">
              <AccordionTrigger className="text-xs tracking-[0.16em] uppercase">
                What&apos;s included
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li>· {product.name}</li>
                  <li>· Premium gift packaging</li>
                  <li>· Care and meaning card</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FREQUENTLY BOUGHT TOGETHER */}
      <section className="shell py-10">
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <p className="eyebrow">Frequently bought together</p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            {[product, ...bundle].map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" loading="lazy" className="size-16 rounded-lg object-cover" />
                <div className="text-sm">
                  <p className="text-ink">{p.name}</p>
                  <p className="text-muted-foreground">{formatINR(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="text-sm text-ink">Bundle total {formatINR(bundleTotal)}</p>
            <Button
              variant="quiet"
              onClick={() => {
                [product, ...bundle].forEach((p) => add(p.id));
                toast.success("Bundle added to cart");
              }}
            >
              Add all three
            </Button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shell py-12">
          <h2 className="text-3xl text-ink md:text-4xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {viewed.length > 0 && (
        <section className="shell py-12">
          <h2 className="text-3xl text-ink md:text-4xl">Recently viewed</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3">
            {viewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />

      {/* Sticky mobile add to cart */}
      <div className="fixed inset-x-0 bottom-14 z-40 border-t border-gold/25 bg-navy px-4 py-3 md:hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-navy-foreground">{product.name}</p>
            <p className="text-xs text-gold">{formatINR(product.price)}</p>
          </div>
          <Button className="h-11 bg-gold px-6 text-gold-foreground hover:bg-gold/90" disabled={soldOut} onClick={addToCart}>
            {soldOut ? "Sold out" : "Add to cart"}
          </Button>
        </div>
      </div>

    </>
  );
}
