import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";


type ShopSearch = {
  category?: string | undefined;
  sort?: string | undefined;
  wishlist?: boolean | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    wishlist: search["wishlist"] === true || search["wishlist"] === "true" ? true : undefined,
  }),


  head: () => ({
    meta: [
      { title: "All Jewelry — Crystal Bracelets & Pendants | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Shop all ShivAmrit Healers jewellery: natural stone bracelets, chakra designs and Tree of Life pendants, filtered by stone, colour and price.",
      },
      { property: "og:title", content: "All Jewelry — Crystal Bracelets & Pendants | ShivAmrit Healers" },
      {
        property: "og:description",
        content: "Natural stone jewellery designed to add meaning and beauty to everyday moments.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category, wishlist: wishlistView } = Route.useSearch();
  const { wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">{wishlistView ? "Saved pieces" : "The collection"}</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">
            {wishlistView ? "Your wishlist" : "All jewelry"}
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
          <div className="rounded-2xl bg-sand p-12 text-center">
            <p className="text-sm text-muted-foreground">You haven&apos;t saved any pieces yet.</p>
            <Button variant="ink" size="xl" className="mt-6" asChild>
              <Link to="/shop" search={{}}>
                Browse all jewellery
              </Link>
            </Button>
          </div>
        ) : (
          <ProductGrid source={wishlistView ? saved : products} initialCategory={category} />
        )}
      </section>


      <Newsletter />
    </>
  );
}
