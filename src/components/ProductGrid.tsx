import { useId, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatINR, type Product } from "@/lib/products";

export type Sort = "featured" | "new" | "price-asc" | "price-desc" | "best";

const sortLabels: Record<Sort, string> = {
  featured: "Featured",
  new: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  best: "Best Selling",
};

function uniq(values: string[]) {
  return [...new Set(values)];
}

export function ProductGrid({
  source,
  initialCategory,
}: {
  source: Product[];
  initialCategory?: string | undefined;
}) {
  const [sort, setSort] = useState<Sort>("featured");
  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [stones, setStones] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const priceCeiling = Math.ceil(Math.max(100, ...source.map((p) => p.price)) / 100) * 100;
  const [priceLimit, setPriceLimit] = useState<number | null>(null);
  const maxPrice = priceLimit == null ? priceCeiling : Math.min(priceLimit, priceCeiling);
  const [quick, setQuick] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const idPrefix = useId();

  const allCategories = uniq(source.map((p) => p.category));
  const allStones = uniq(source.map((p) => p.stoneType));
  const allColors = uniq(source.map((p) => p.color));
  const hasFilters = categories.length > 0 || stones.length > 0 || colors.length > 0 || inStockOnly || maxPrice < priceCeiling;
  const activeCount = categories.length + stones.length + colors.length + Number(inStockOnly) + Number(maxPrice < priceCeiling);

  const clearFilters = () => {
    setCategories([]);
    setStones([]);
    setColors([]);
    setInStockOnly(false);
    setPriceLimit(null);
  };

  const filtered = useMemo(() => {
    const list = source.filter(
      (p) =>
        (categories.length === 0 || categories.includes(p.category)) &&
        (stones.length === 0 || stones.includes(p.stoneType)) &&
        (colors.length === 0 || colors.includes(p.color)) &&
        (!inStockOnly || p.inventory > 0) &&
        p.price <= maxPrice,
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "best") sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === "new") sorted.reverse();
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [source, categories, stones, colors, inStockOnly, maxPrice, sort]);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filters = (prefix: string) => (
    <div className="flex flex-col gap-8">
      {allCategories.length > 1 && <FilterGroup title="Category">
        {allCategories.map((c) => (
          <CheckRow
            key={c}
            id={`${prefix}-cat-${c}`}
            label={c}
            checked={categories.includes(c)}
            onChange={() => toggle(c, categories, setCategories)}
          />
        ))}
      </FilterGroup>}

      <FilterGroup title={`Price · up to ${formatINR(maxPrice)}`}>
        <Slider
          value={[maxPrice]}
          min={0}
          max={priceCeiling}
          step={Math.max(1, Math.ceil(priceCeiling / 40 / 100) * 100)}
          onValueChange={(v) => setPriceLimit(v[0] ?? priceCeiling)}
          aria-label="Maximum price"
          className="mt-2"
        />
      </FilterGroup>

      {allStones.length > 1 && <FilterGroup title="Stone">
        {allStones.map((s) => (
          <CheckRow
            key={s}
            id={`${prefix}-stone-${s}`}
            label={s}
            checked={stones.includes(s)}
            onChange={() => toggle(s, stones, setStones)}
          />
        ))}
      </FilterGroup>}

      {allColors.length > 1 && <FilterGroup title="Colour">
        {allColors.map((c) => (
          <CheckRow
            key={c}
            id={`${prefix}-color-${c}`}
            label={c}
            checked={colors.includes(c)}
            onChange={() => toggle(c, colors, setColors)}
          />
        ))}
      </FilterGroup>}

      <FilterGroup title="Availability">
        <CheckRow
          id={`${prefix}-in-stock`}
          label="In stock only"
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
        />
      </FilterGroup>
      {hasFilters && <Button variant="quiet" size="sm" onClick={clearFilters}>Clear filters</Button>}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">{filters(`${idPrefix}-desktop`)}</aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            {filtered.length} of {source.length} pieces
          </p>
          <div className="flex items-center gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="quiet" size="sm" className="h-9">
                  <SlidersHorizontal /> Filter{activeCount > 0 ? ` (${activeCount})` : ""}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-xl">Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-6 pb-20">{filters(`${idPrefix}-mobile`)}</div>
                <div className="sticky bottom-0 -mx-6 border-t border-border bg-background p-4">
                  <Button className="w-full" onClick={() => setFiltersOpen(false)}>Show {filtered.length} pieces</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="h-9 w-[165px] text-xs" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(sortLabels) as Sort[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {sortLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {[...categories.map((value) => ({ value, remove: () => toggle(value, categories, setCategories) })), ...stones.map((value) => ({ value, remove: () => toggle(value, stones, setStones) })), ...colors.map((value) => ({ value, remove: () => toggle(value, colors, setColors) })), ...(inStockOnly ? [{ value: "In stock", remove: () => setInStockOnly(false) }] : []), ...(maxPrice < priceCeiling ? [{ value: `Under ${formatINR(maxPrice)}`, remove: () => setPriceLimit(null) }] : [])].map(({ value, remove }) => (
              <Button key={value} variant="outline" size="sm" onClick={remove} aria-label={`Remove ${value} filter`} className="h-8 max-w-full gap-1 overflow-hidden text-xs">
                <span className="truncate">{value}</span><X className="shrink-0" />
              </Button>
            ))}
            <Button variant="link" size="sm" onClick={clearFilters}>Clear all</Button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">No pieces match these filters yet.</p>
            <Button variant="quiet" size="sm" className="mt-5" onClick={clearFilters}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} imageFit={p.collection.includes("zodiac-crystal-collection") ? "contain" : "cover"} onQuickView={setQuick} />
            ))}
          </div>
        )}
      </div>

      <QuickView product={quick} onOpenChange={(o) => !o && setQuick(null)} />
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <div className="mt-3.5 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <Label htmlFor={id} className="text-sm leading-snug font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}
