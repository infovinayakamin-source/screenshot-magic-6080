import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatINR, discountPercent, useProducts, type Product } from "@/lib/products";

const PAGE = 9;
const schema = z.object({
  q: fallback(z.string(), "").default(""),
  stock: fallback(z.string(), "").default(""),
  min: fallback(z.number(), 0).default(0),
  max: fallback(z.number(), 0).default(0),
  sort: fallback(z.string(), "featured").default("featured"),
  show: fallback(z.number(), PAGE).default(PAGE),
});

/** Salt / bath-salt products identified by their actual name, stones or description. */
export const isSaltProduct = (p: Product) => /\bsalts?\b/i.test([p.name, p.stones, p.shortDescription].join(" "));

export const Route = createFileRoute("/collections/salt")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Salt Collection | ShivAmrit Healers" },
      { name: "description", content: "Browse ShivAmrit Healers salt and bath-salt products with search, price and availability filters." },
      { property: "og:title", content: "Salt Collection | ShivAmrit Healers" },
      { property: "og:description", content: "Salt and bath-salt products from ShivAmrit Healers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://storeshivamrithealers.lovable.app/collections/salt" }],
  }),
  component: SaltPage,
});

function SaltPage() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/collections/salt" });
  const set = (patch: Partial<typeof s>) => navigate({ search: (prev) => ({ ...prev, show: PAGE, ...patch }), replace: true });
  const all = useProducts().filter(isSaltProduct);
  const ceiling = Math.max(0, ...all.map((p) => p.price));
  const min = Math.max(0, s.min);
  const max = s.max > 0 ? Math.min(s.max, ceiling) : ceiling;
  const stockSel = s.stock.split(",").filter(Boolean);
  const inCount = all.filter((p) => p.stockStatus !== "out").length;
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const q = s.q.trim().toLowerCase();
    const r = all.filter((p) =>
      (!q || [p.name, p.nameHi, p.stones].join(" ").toLowerCase().includes(q)) &&
      (stockSel.length === 0 || stockSel.includes(p.stockStatus === "out" ? "out" : "in")) &&
      p.price >= min && p.price <= max);
    if (s.sort === "price-asc") r.sort((a, b) => a.price - b.price);
    else if (s.sort === "price-desc") r.sort((a, b) => b.price - a.price);
    else if (s.sort === "az") r.sort((a, b) => a.name.localeCompare(b.name));
    else r.sort((a, b) => Number(b.featured) - Number(a.featured));
    return r;
  }, [all, s.q, s.sort, stockSel.join(), min, max]);

  const shown = list.slice(0, Math.max(PAGE, s.show));
  const toggleStock = (v: string) => set({ stock: (stockSel.includes(v) ? stockSel.filter((x) => x !== v) : [...stockSel, v]).join(",") });
  const clear = () => navigate({ search: { q: s.q, stock: "", min: 0, max: 0, sort: s.sort, show: PAGE }, replace: true });

  const filters = (
    <div className="flex flex-col gap-6">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full border-b border-border pb-2 text-left text-sm font-semibold">Availability</CollapsibleTrigger>
        <CollapsibleContent className="mt-3 flex flex-col gap-2.5">
          {[["in", `In stock (${inCount})`], ["out", `Out of stock (${all.length - inCount})`]].map(([v, l]) => (
            <div key={v} className="flex items-center gap-2"><Checkbox id={`salt-${v}`} checked={stockSel.includes(v!)} onCheckedChange={() => toggleStock(v!)} /><Label htmlFor={`salt-${v}`} className="font-normal">{l}</Label></div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full border-b border-border pb-2 text-left text-sm font-semibold">Price</CollapsibleTrigger>
        <CollapsibleContent className="mt-3 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" aria-label="Minimum price" min={0} value={min} onChange={(e) => set({ min: Number(e.target.value) || 0 })} />
            <Input type="number" aria-label="Maximum price" min={0} value={max} onChange={(e) => set({ max: Number(e.target.value) || 0 })} />
          </div>
          <Slider value={[min, max]} min={0} max={ceiling || 1} step={10} disabled={!ceiling} onValueChange={(v) => set({ min: v[0] ?? 0, max: v[1] ?? 0 })} aria-label="Price range" />
        </CollapsibleContent>
      </Collapsible>
      <Button variant="outline" size="sm" onClick={clear}>Clear filters</Button>
    </div>
  );

  return (
    <section className="shell py-10 md:py-14">
      <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/shop">Shop All</Link> / <span className="text-foreground">Salt</span></nav>
      <h1 className="mt-4 text-center text-4xl md:text-5xl">Salt</h1>
      <div className="relative mx-auto mt-6 max-w-2xl">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search salt products" placeholder="Search in Salt" maxLength={100} value={s.q} onChange={(e) => set({ q: e.target.value })} className="h-12 rounded-full pl-11" />
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_3fr]">
        <aside className="hidden md:block">{filters}</aside>
        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild><Button variant="outline" size="sm" className="md:hidden"><SlidersHorizontal /> Filter</Button></SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto"><SheetHeader><SheetTitle>Filter</SheetTitle></SheetHeader><div className="mt-6">{filters}</div><Button className="mt-6 w-full" onClick={() => setOpen(false)}>Show {list.length} products</Button></SheetContent>
              </Sheet>
              <p className="text-sm text-muted-foreground" aria-live="polite">{list.length} products</p>
            </div>
            <Select value={s.sort} onValueChange={(v) => set({ sort: v })}>
              <SelectTrigger className="w-[170px]" aria-label="Sort products"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price, low to high</SelectItem>
                <SelectItem value="price-desc">Price, high to low</SelectItem>
                <SelectItem value="az">Alphabetical, A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {list.length === 0 ? (
            <div className="rounded-lg border border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">{all.length === 0 ? "Salt products are coming soon. Please check back shortly." : "No salt products match these filters."}</p>
              {all.length > 0 && <Button variant="outline" size="sm" className="mt-4" onClick={clear}>Clear filters</Button>}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {shown.map((p) => (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group text-center">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <img src={p.images[0]} alt={p.name} loading="lazy" width={600} height={600} className="size-full object-cover" />
                      {discountPercent(p) > 0 && <span className="absolute left-2 top-2 rounded bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">-{discountPercent(p)}%</span>}
                    </div>
                    <h3 className="mt-3 text-sm">{p.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-primary">{formatINR(p.price)} {p.compareAtPrice && <del className="ml-1 font-normal text-muted-foreground">{formatINR(p.compareAtPrice)}</del>}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">Showing {shown.length} of {list.length} products</p>
                {shown.length < list.length && <Button variant="outline" className="mt-3" onClick={() => navigate({ search: (prev) => ({ ...prev, show: shown.length + PAGE }), replace: true })}>Load more</Button>}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
