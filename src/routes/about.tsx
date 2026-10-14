import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { BRAND } from "@/lib/products";
import { zodiacItems } from "@/lib/zodiac";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Jewelry With Meaning — Our Story | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "ShivAmrit Healers is built around natural stones, careful craftsmanship and modern design — jewellery made for intention, everyday wear and meaningful gifting.",
      },
      { property: "og:title", content: "Jewelry With Meaning — Our Story | ShivAmrit Healers" },
      {
        property: "og:description",
        content: "Natural stones, careful craftsmanship and quiet, modern design.",
      },
    ],
  }),
  component: About,
});

const pillars = [
  {
    title: "Natural stones",
    copy: "We work with natural stones, so colour, veining and texture vary from piece to piece. That variation is the point.",
  },
  {
    title: "Craftsmanship",
    copy: "Each piece is hand-strung or wire-wrapped and checked by hand for finish, tension and comfort before it ships.",
  },
  {
    title: "Personal intention",
    copy: "Stones have carried symbolic meaning across cultures for centuries. We share those traditions without overstating them.",
  },
  {
    title: "Modern design",
    copy: "Minimal silhouettes, restrained metal and a calm palette, made to sit alongside the jewellery you already wear.",
  },
  {
    title: "Meaningful gifting",
    copy: "Everything arrives in premium packaging with a care and meaning card, ready to give as it is.",
  },
];

function About() {
  return (
    <>
      <section className="shell py-16 text-center md:py-24">
        <p className="eyebrow">Our story</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] text-ink md:text-7xl">
          Jewelry with meaning.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {BRAND} began with a simple idea: that the jewellery we wear every day can be beautiful and
          personal at the same time.
        </p>
      </section>

      <Reveal className="shell">
        {zodiacItems[0] && (
          <img
            src={zodiacItems[0].image}
            alt="Aries zodiac crystal bracelet on a gold stand"
            loading="lazy"
            className="mx-auto aspect-square w-full max-w-3xl rounded-2xl object-cover"
          />
        )}

      </Reveal>

      <section className="shell grid gap-12 py-20 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <h2 className="text-3xl text-ink md:text-5xl">
            Made slowly, worn daily.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            We source natural stones in small batches, string them by hand and keep our designs deliberately
            quiet. Nothing here is meant to be worn once. Our pieces are made to move with you — to work,
            to dinner, to the everyday moments in between.
          </p>
          <Button variant="quiet" size="xl" className="mt-8" asChild>
            <Link to="/shop">Shop the collection</Link>
          </Button>
        </Reveal>
        <Reveal delay={80} className="grid gap-8 sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title}>
              <h3 className="text-xs tracking-[0.18em] text-ink uppercase">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal className="shell">
        {zodiacItems[1] && (
          <img
            src={zodiacItems[1].image}
            alt="Taurus zodiac crystal bracelet on a gold stand"
            loading="lazy"
            className="mx-auto aspect-square w-full max-w-3xl rounded-2xl object-cover"
          />
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Our pieces are designed for style, symbolism and personal ritual. They are not medical products
          and are not intended to treat, cure or prevent any condition.
        </p>
      </Reveal>

      <Newsletter />
    </>
  );
}
