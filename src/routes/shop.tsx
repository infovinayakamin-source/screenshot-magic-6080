import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/products";
import { useStore } from "@/lib/store";


type ShopSearch = {
  category?: string | undefined;
  stone?: string | undefined;
  sort?: string | undefined;
  wishlist?: boolean | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    stone: typeof search["stone"] === "string" ? search["stone"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    wishlist: search["wishlist"] === true || search["wishlist"] === "true" ? true : undefined,
  }),


  head: () => ({
    meta: [
      { title: "All Jewelry — Zodiac Crystal Bracelets | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Shop ShivAmrit Healers zodiac crystal bracelets, filtered by stone, colour and price.",
      },
      { property: "og:title", content: "All Jewelry — Zodiac Crystal Bracelets | ShivAmrit Healers" },
      {
        property: "og:description",
        content: "Natural stone jewellery designed to add meaning and beauty to everyday moments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, stone, wishlist: wishlistView } = Route.useSearch();
  const { wishlist } = useStore();
  const products = useProducts();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <section className="border-b border-gold/40 bg-background">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">{wishlistView ? "Saved pieces" : "The collection"}</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">
            {wishlistView ? "Your wishlist" : stone ? `${stone} Bracelets` : "All jewelry"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {wishlistView
              ? "The pieces you've saved for later."
              : "Discover natural stone jewellery designed to add meaning and beauty to everyday moments."}
          </p>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        {wishlistView && saved.length === 0 ? (
          <div className="border-y border-gold/50 bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">You haven&apos;t saved any pieces yet.</p>
            <Button variant="ink" size="xl" className="mt-6" asChild>
              <Link to="/shop" search={{}}>
                Browse all jewellery
              </Link>
            </Button>
          </div>
        ) : (
          <ProductGrid source={wishlistView ? saved : stone ? products.filter(p => p.stones.toLowerCase().includes(stone.toLowerCase())) : products} initialCategory={category} />
        )}
      </section>


      <Newsletter />
    </>
  );
}
