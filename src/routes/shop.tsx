import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { products } from "@/lib/products";

type ShopSearch = { category: string; sort: string; wishlist: boolean };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : "",
    sort: typeof search["sort"] === "string" ? search["sort"] : "",
    wishlist: search["wishlist"] === true || search["wishlist"] === "true",
  }),

  head: () => ({
    meta: [
      { title: "All Jewelry — Crystal Bracelets & Pendants | Aarohi" },
      {
        name: "description",
        content:
          "Shop all Aarohi jewellery: natural stone bracelets, chakra designs and Tree of Life pendants, filtered by stone, colour and price.",
      },
      { property: "og:title", content: "All Jewelry — Crystal Bracelets & Pendants | Aarohi" },
      {
        property: "og:description",
        content: "Natural stone jewellery designed to add meaning and beauty to everyday moments.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();

  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">All jewelry</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Discover natural stone jewellery designed to add meaning and beauty to everyday moments.
          </p>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <ProductGrid source={products} initialCategory={category} />
      </section>

      <Newsletter />
    </>
  );
}
