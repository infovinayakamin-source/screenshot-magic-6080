import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { collections, getCollection, productsInCollection } from "@/lib/products";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = getCollection(params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Collection not found | Aarohi" }, { name: "robots", content: "noindex" }] };
    }
    const { collection } = loaderData;
    const title = `${collection.name} | Aarohi`;
    return {
      meta: [
        { title },
        { name: "description", content: collection.description },
        { property: "og:title", content: title },
        { property: "og:description", content: collection.description },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const items = productsInCollection(collection.slug);
  const related = collections.filter((c) => c.slug !== collection.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-background/72 backdrop-blur-[2px]" />
        <div className="shell relative py-16 text-center md:py-24">
          <nav className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <Link to="/" className="hover:text-ink">Home</Link>
            <span className="px-2">/</span>
            <Link to="/collections" className="hover:text-ink">Collections</Link>
          </nav>
          <h1 className="mt-4 text-4xl text-ink md:text-6xl">{collection.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <ProductGrid source={items} />
      </section>

      <section className="shell pb-8">
        <p className="eyebrow">Related collections</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {related.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$slug"
              params={{ slug: c.slug }}
              className="group flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-sand"
            >
              <img src={c.image} alt="" loading="lazy" className="size-16 rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block truncate font-display text-lg text-ink">{c.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {productsInCollection(c.slug).length} pieces
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
