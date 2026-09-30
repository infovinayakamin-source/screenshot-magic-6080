import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProduct, type Product } from "@/lib/products";
import { ZODIAC_SIGNS, zodiacItems, zodiacTitle } from "@/lib/zodiac";
import { cn } from "@/lib/utils";

const DESC =
  "Explore crystal bracelets inspired by the 12 zodiac signs. Find your sign and choose a style that feels personal.";

export const Route = createFileRoute("/collections/zodiac-crystal-collection")({
  head: () => ({
    meta: [
      { title: "Zodiac Crystal Collection | ShivAmrit Healers" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Zodiac Crystal Collection | ShivAmrit Healers" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ZodiacPage,
});

type Sort = "default" | "price-asc" | "price-desc";

function ZodiacPage() {
  const [sign, setSign] = useState("all");
  const [sort, setSort] = useState<Sort>("default");
  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);

  const list = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const l = zodiacItems.filter((z) =>
      (sign === "all" || z.sign === sign) &&
      (!inStockOnly || (z.inventory ?? 0) > 0) &&
      (!normalized || `${z.sign} ${z.hindi} ${zodiacTitle(z)}`.toLocaleLowerCase().includes(normalized))
    );
    if (sort !== "default") {
      l.sort((a, b) => {
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return sort === "price-asc" ? a.price - b.price : b.price - a.price;
      });
    }
    return l;
  }, [sign, sort, query, inStockOnly]);

  const clearFilters = () => { setSign("all"); setQuery(""); setInStockOnly(false); };

  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <nav aria-label="Breadcrumb" className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span className="px-2">/</span>
            <Link to="/collections" className="hover:text-ink">Collections</Link>
          </nav>
          <h1 className="mt-4 text-4xl text-ink md:text-6xl">Zodiac Crystal Collection</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{DESC}</p>
        </div>
      </section>

      <section className="shell py-12 md:py-16" aria-labelledby="zodiac-shop">
        <h2 id="zodiac-shop" className="text-3xl text-ink md:text-4xl">Shop by Zodiac Sign</h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find your sign" aria-label="Search zodiac signs" className="max-w-sm" />
          <div className="flex items-center gap-2">
            <Checkbox id="zodiac-in-stock" checked={inStockOnly} onCheckedChange={(checked) => setInStockOnly(checked === true)} />
            <Label htmlFor="zodiac-in-stock" className="text-sm text-ink">In stock only</Label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by zodiac sign">
            {[{ en: "all", hi: "" }, ...ZODIAC_SIGNS].map((s) => (
              <Button
                key={s.en}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSign(s.en)}
                aria-pressed={sign === s.en}
                className={cn(
                  "h-8 rounded-sm px-3.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  sign === s.en
                    ? "border-navy bg-navy text-gold"
                    : "border-border bg-card text-ink hover:bg-sand",
                )}
              >
                {s.en === "all" ? "All Signs" : `${s.en} • ${s.hi}`}
              </Button>
            ))}
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-9 w-[170px] text-xs" aria-label="Sort zodiac bracelets">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="text-xs">Featured</SelectItem>
              <SelectItem value="price-asc" className="text-xs">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-xs">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <p aria-live="polite">Showing {list.length} of {zodiacItems.length} bracelets</p>
          {(sign !== "all" || query || inStockOnly) && <Button variant="link" size="sm" onClick={clearFilters}>Clear filters</Button>}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-display text-2xl text-ink">No bracelets found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another sign or clear your filters.</p>
            <Button variant="quiet" size="sm" className="mt-5" onClick={clearFilters}>
              Show all signs
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((z) => {
              const product = getProduct(z.slug);
              return product ? <ProductCard key={z.sign} product={product} imageFit="contain" onQuickView={setQuick} /> : null;
            })}
          </div>
        )}
      </section>
      <QuickView product={quick} onOpenChange={(open) => !open && setQuick(null)} />
    </>
  );
}
