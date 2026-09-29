import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Sparkles, Hand, ShieldCheck, Leaf, Clock, BadgeCheck, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";
import { Newsletter } from "@/components/Newsletter";
import { Stars } from "@/components/Stars";
import {
  BRAND,
  collections,
  editorialImage,
  heroImage,
  lifestyleImages,
  products,
  type Product,
} from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Crystal Jewelry & Natural Stone Bracelets | Aarohi" },
      {
        name: "description",
        content:
          "Discover premium crystal jewellery, natural stone bracelets and meaningful Tree of Life designs. Shop elegant pieces created for everyday style and gifting.",
      },
      { property: "og:title", content: "Premium Crystal Jewelry & Natural Stone Bracelets | Aarohi" },
      {
        property: "og:description",
        content:
          "Natural stone bracelets and Tree of Life pendants, crafted for everyday style, intention and meaningful gifting.",
      },
    ],
  }),
  component: Home,
});

const trust = [
  { icon: Gem, label: "Natural Stone Jewelry" },
  { icon: Sparkles, label: "Carefully Selected Crystals" },
  { icon: Hand, label: "Premium Craftsmanship" },
  { icon: ShieldCheck, label: "Secure & Easy Checkout" },
];

const meaning = [
  { title: "Intention", copy: "Choose pieces that represent what matters to you." },
  { title: "Mindfulness", copy: "Create small moments of calm in your everyday routine." },
  { title: "Style", copy: "Beautiful natural stones designed to complement modern outfits." },
  { title: "Meaning", copy: "Jewelry that can hold personal memories, intentions and stories." },
];

const why = [
  { icon: Leaf, title: "Natural Materials", copy: "Carefully selected stones and materials." },
  { icon: Clock, title: "Timeless Design", copy: "Minimal designs made for everyday styling." },
  { icon: BadgeCheck, title: "Quality Focus", copy: "Attention to finish, comfort and presentation." },
  { icon: Gift, title: "Meaningful Gifting", copy: "Thoughtful pieces for yourself or someone special." },
];

const reviews = [
  { text: "Beautiful bracelet and the colour is even better in person.", name: "Verified Customer", rating: 5 },
  { text: "Packaging was beautiful and the pendant looks premium.", name: "Verified Customer", rating: 5 },
  { text: "Really elegant piece for everyday wear.", name: "Verified Customer", rating: 4 },
];

function Home() {
  const [quick, setQuick] = useState<Product | null>(null);
  const bestsellers = products.filter((p) => p.bestseller || p.featured).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-sand">
        <div className="shell grid items-center gap-10 py-14 md:grid-cols-2 md:gap-12 md:py-24">
          <div className="reveal max-w-xl">
            <p className="eyebrow">Natural stone jewellery</p>
            <h1 className="mt-5 text-[2.75rem] leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Wear your energy.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Thoughtfully crafted crystal jewellery designed to bring beauty, intention and meaning into
              your everyday style.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="ink" size="xl" asChild>
                <Link to="/shop">Shop collection</Link>
              </Button>
              <Button variant="quiet" size="xl" asChild>
                <Link to="/collections">Explore crystals</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Turquoise stone bracelet and Tree of Life crystal pendant on warm ivory stone"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
            />
            <div className="absolute -bottom-5 left-4 hidden rounded-xl bg-background/95 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur sm:block">
              <Stars rating={5} />
              <p className="mt-1.5 text-xs text-muted-foreground">Rated 4.8 by 600+ customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border">
        <div className="shell grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:py-10">
          {trust.map((t) => (
            <div key={t.label} className="flex min-w-0 items-center gap-3">
              <t.icon className="size-5 shrink-0 text-primary" strokeWidth={1.4} />
              <span className="min-w-0 text-xs leading-snug tracking-[0.08em] text-ink uppercase">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="shell py-20 md:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Curated edits</p>
            <h2 className="mt-3 text-3xl text-ink md:text-5xl">Shop by collection</h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-ink uppercase hover:opacity-70"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="mt-4 font-display text-xl text-ink">{c.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-ink uppercase">
                  Explore collection <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-sand/50 py-20 md:py-24">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow">Loved most</p>
            <h2 className="mt-3 text-3xl text-ink md:text-5xl">Bestsellers</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Meaningful pieces designed to complement your everyday style.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3">
            {bestsellers.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ProductCard product={p} onQuickView={setQuick} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="quiet" size="xl" asChild>
              <Link to="/shop">View all jewellery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MORE THAN JEWELRY */}
      <section className="shell py-20 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={editorialImage}
              alt="Natural stones, beads and jewellery tools on a linen workbench"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Our philosophy</p>
            <h2 className="mt-3 text-3xl text-ink md:text-5xl">More than jewelry</h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Every stone carries a story, a colour and a personal meaning. Our collection is created for
              people who love combining timeless jewellery with intention, symbolism and mindful everyday
              rituals.
            </p>
            <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {meaning.map((m) => (
                <div key={m.title}>
                  <h3 className="text-xs tracking-[0.18em] text-ink uppercase">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-y border-border bg-sand/50 py-20 md:py-24">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow">Why {BRAND}</p>
            <h2 className="mt-3 text-3xl text-ink md:text-5xl">Crafted with intention</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 60} className="text-center">
                <w.icon className="mx-auto size-6 text-primary" strokeWidth={1.3} />
                <h3 className="mt-4 text-xs tracking-[0.18em] text-ink uppercase">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="shell py-20 md:py-24">
        <Reveal className="text-center">
          <p className="eyebrow">Social proof</p>
          <h2 className="mt-3 text-3xl text-ink md:text-5xl">Loved by our community</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.text} delay={i * 70}>
              <figure className="h-full rounded-2xl border border-border bg-card p-7">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 font-display text-xl leading-snug text-ink">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  — {r.name}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="shell pb-4">
        <Reveal className="text-center">
          <p className="eyebrow">@aarohi.jewels</p>
          <h2 className="mt-3 text-3xl text-ink md:text-5xl">Follow the journey</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {lifestyleImages.map((img, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-lg bg-sand"
            >
              <img
                src={img}
                alt="Styling inspiration from our community"
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-ink uppercase hover:opacity-70"
          >
            Follow us on Instagram <ArrowRight className="size-3.5" />
          </a>
        </div>
      </section>

      <Newsletter />
      <QuickView product={quick} onOpenChange={(o) => !o && setQuick(null)} />
    </>
  );
}
