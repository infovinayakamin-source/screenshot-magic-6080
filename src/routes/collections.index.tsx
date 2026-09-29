import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { collections, productsInCollection } from "@/lib/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Chakra, Tree of Life & Crystal Edits | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Browse ShivAmrit Healers collections: crystal bracelets, chakra jewellery, Tree of Life pendants and ready-to-give gift sets.",
      },
      { property: "og:title", content: "Collections | ShivAmrit Healers" },
      {
        property: "og:description",
        content: "Curated edits of natural stone jewellery, grouped by stone, symbol and occasion.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">Curated edits</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">Collections</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Six edits, grouped by stone, symbol and the way you like to wear them.
          </p>
        </div>
      </section>

      <section className="shell grid gap-x-5 gap-y-12 py-14 sm:grid-cols-2 md:py-20 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={i * 60}>
            <Link to="/collections/$slug" params={{ slug: c.slug }} className="group block">
              <div className="overflow-hidden rounded-xl bg-sand">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <h2 className="mt-4 font-display text-2xl text-ink">{c.name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {productsInCollection(c.slug).length} pieces
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-ink uppercase">
                Explore collection{" "}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>

      <Newsletter />
    </>
  );
}
