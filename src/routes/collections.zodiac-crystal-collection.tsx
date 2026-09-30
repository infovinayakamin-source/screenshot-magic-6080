import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/products";
import { ZODIAC_SIGNS, zodiacItems, zodiacTitle, type ZodiacItem } from "@/lib/zodiac";
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

  const list = useMemo(() => {
    const l = zodiacItems.filter((z) => sign === "all" || z.sign === sign);
    if (sort !== "default") {
      l.sort((a, b) => {
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return sort === "price-asc" ? a.price - b.price : b.price - a.price;
      });
    }
    return l;
  }, [sign, sort]);

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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by zodiac sign">
            {[{ en: "all", hi: "" }, ...ZODIAC_SIGNS].map((s) => (
              <button
                key={s.en}
                type="button"
                onClick={() => setSign(s.en)}
                aria-pressed={sign === s.en}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  sign === s.en
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-ink hover:bg-sand",
                )}
              >
                {s.en === "all" ? "All Signs" : `${s.en} • ${s.hi}`}
              </button>
            ))}
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-9 w-[170px] text-xs" aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="text-xs">Featured</SelectItem>
              <SelectItem value="price-asc" className="text-xs">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-xs">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-display text-2xl text-ink">This sign is coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">We're still preparing this bracelet.</p>
            <Button variant="quiet" size="sm" className="mt-5" onClick={() => setSign("all")}>
              Show all signs
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((z) => (
              <ZodiacCard key={z.sign} item={z} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ZodiacCard({ item }: { item: ZodiacItem }) {
  const title = zodiacTitle(item);
  const stock =
    item.inventory == null ? "Availability on request" : item.inventory > 0 ? "In stock" : "Sold out";
  const msg = encodeURIComponent(`Hi, I'm interested in the ${item.sign} Crystal Bracelet.`);
  return (
    <article className="group flex flex-col">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
        <img
          src={item.image}
          alt={`${item.sign} crystal bracelet on a gold stand engraved ${item.hindi} ${item.sign}`}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-contain"
        />
      </div>
      <h3 className="mt-3 font-display text-lg leading-snug text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink">
        {item.price != null ? formatINR(item.price) : "Price coming soon"}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{stock}</p>
      <Button asChild variant="quiet" size="sm" className="mt-3 w-full">
        <a href={`https://wa.me/910000000000?text=${msg}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle /> Enquire
        </a>
      </Button>
    </article>
  );
}
