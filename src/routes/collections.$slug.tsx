import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { getCollection, useProducts } from "@/lib/products";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection not found | ShivAmrit Healers" }, { name: "robots", content: "noindex" }] };
    }
    const { collection } = loaderData;
    const title = `${collection.name} | ShivAmrit Healers`;
    return {
      meta: [
        { title },
        { name: "description", content: collection.description },
        { property: "og:title", content: title },
        { property: "og:description", content: collection.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const items = useProducts();

  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
          <div>
          <nav className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span className="px-2">/</span>
            <Link to="/collections" className="hover:text-ink">Collections</Link>
          </nav>
          <h1 className="mt-4 text-4xl text-ink md:text-6xl">{collection.name}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
          </div>
          <img src={collection.image} alt={collection.name} className="aspect-[1.5] w-full rounded-[8px] border border-gold/40 bg-background object-contain md:aspect-[1.25]" />
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <ProductGrid source={items} />
      </section>

      <Newsletter />
    </>
  );
}
