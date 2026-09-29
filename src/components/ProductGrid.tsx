import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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
import { type Product } from "@/lib/products";

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
  initialCategory?: string;
}) {
  const [sort, setSort] = useState<Sort>("featured");
  const [categories, setCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [stones, setStones] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [quick, setQuick] = useState<Product | null>(null);

  const allCategories = uniq(source.map((p) => p.category));
  const allStones = uniq(source.map((p) => p.stoneType));
  const allColors = uniq(source.map((p) => p.color));

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

  const filters = (
    <div className="flex flex-col gap-8">
      <FilterGroup title="Category">
        {allCategories.map((c) => (
          <CheckRow
            key={c}
            id={`cat-${c}`}
            label={c}
            checked={categories.includes(c)}
            onChange={() => toggle(c, categories, setCategories)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={`Price · up to ₹${maxPrice.toLocaleString("en-IN")}`}>
        <Slider
          value={[maxPrice]}
          min={1000}
          max={4000}
          step={100}
          onValueChange={(v) => setMaxPrice(v[0] ?? 4000)}
          className="mt-2"
        />
      </FilterGroup>

      <FilterGroup title="Stone">
        {allStones.map((s) => (
          <CheckRow
            key={s}
            id={`stone-${s}`}
            label={s}
            checked={stones.includes(s)}
            onChange={() => toggle(s, stones, setStones)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Colour">
        {allColors.map((c) => (
          <CheckRow
            key={c}
            id={`color-${c}`}
            label={c}
            checked={colors.includes(c)}
            onChange={() => toggle(c, colors, setColors)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow
          id="in-stock"
          label="In stock only"
          checked={inStockOnly}
          onChange={() => setInStockOnly(!inStockOnly)}
        />
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">{filters}</aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            {filtered.length} pieces
          </p>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="quiet" size="sm" className="h-9">
                  <SlidersHorizontal /> Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-xl">Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{filters}</div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="h-9 w-[165px] text-xs">
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

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No pieces match these filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
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
