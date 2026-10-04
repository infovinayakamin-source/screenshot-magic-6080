import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { collections, productsInCollection } from "@/lib/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Zodiac Crystal Bracelets | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Explore the Zodiac Crystal Bracelet collection by ShivAmrit Healers.",
      },
      { property: "og:title", content: "Zodiac Crystal Bracelets | ShivAmrit Healers" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Natural stone bracelets inspired by your zodiac sign.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <>
      <section className="border-b border-gold/40 bg-background">
        <div className="shell py-14 text-center md:py-20">
          <p className="eyebrow">Curated edits</p>
          <h1 className="mt-3 text-4xl text-ink md:text-6xl">Collections</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            One collection, inspired by your zodiac sign.
          </p>
        </div>
      </section>

      <section className="shell grid gap-x-5 gap-y-12 py-14 sm:grid-cols-2 md:py-20 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={i * 60}>
            <Link to="/collections/zodiac-crystal-collection" className="group block">
              <div className="overflow-hidden rounded-xl bg-sand">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-square w-full object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
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
