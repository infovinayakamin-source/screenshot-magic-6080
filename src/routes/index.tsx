import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Sparkles, Hand, ShieldCheck, Leaf, Clock, BadgeCheck, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { Stars } from "@/components/Stars";
import { zodiacItems } from "@/lib/zodiac";
import {
  BRAND,
  editorialImage,
  heroImage,
  lifestyleImages,
  products,
} from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Crystal Jewelry & Natural Stone Bracelets | ShivAmrit Healers" },
      {
        name: "description",
        content:
          "Discover premium crystal jewellery, natural stone bracelets and meaningful Tree of Life designs. Shop elegant pieces created for everyday style and gifting.",
      },
      { property: "og:title", content: "Premium Crystal Jewelry & Natural Stone Bracelets | ShivAmrit Healers" },
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
  { icon: Gem, label: "Natural Stone Jewelry", sub: "Carefully selected materials" },
  { icon: Hand, label: "Premium Craftsmanship", sub: "Designed with attention to detail" },
  { icon: ShieldCheck, label: "Secure Checkout", sub: "Safe & simple payments" },
  { icon: Sparkles, label: "Easy Shipping", sub: "Reliable delivery across India" },
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
  const treeOfLife = products.find((p) => p.slug === "tree-of-life-chakra-pendant");

  return (
    <>
      {/* HERO — dark navy cinematic banner with gold serif headline */}
      <section className="relative overflow-hidden bg-navy">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/90" />
        <div className="shell relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center md:min-h-[80vh]">
          <p className="reveal text-xs tracking-[0.4em] text-white/80 uppercase">
            Natural stone jewellery
          </p>
          <h1 className="reveal mt-6 font-display text-5xl leading-[1.02] text-gold sm:text-7xl lg:text-8xl">
            Wear your energy.
          </h1>
          <div className="reveal mt-6 flex items-center gap-4 text-gold" aria-hidden>
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 sm:w-24" />
            <Gem className="size-5" strokeWidth={1.2} />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 sm:w-24" />
          </div>
          <p className="reveal mt-6 max-w-xl font-display text-lg italic text-white/90 sm:text-2xl">
            Thoughtfully crafted crystal jewellery for beauty, intention and everyday meaning.
          </p>
          <div className="reveal mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="xl"
              asChild
              className="rounded-full border border-gold bg-transparent px-10 text-gold hover:bg-gold hover:text-navy"
            >
              <Link to="/shop">Shop collection</Link>
            </Button>
            <Button
              size="xl"
              asChild
              className="rounded-full border border-white/30 bg-transparent px-10 text-white hover:bg-white hover:text-navy"
            >
              <Link to="/collections">Explore crystals</Link>
            </Button>
          </div>
          <div className="reveal mt-10 flex items-center gap-2 text-white/70">
            <Stars rating={5} />
            <span className="text-xs">Rated 4.8 by 600+ customers</span>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border">
        <div className="shell grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:py-10">
          {trust.map((t) => (
            <div key={t.label} className="flex min-w-0 flex-col items-center gap-2 text-center">
              <t.icon className="size-6 shrink-0 text-primary" strokeWidth={1.4} />
              <span className="min-w-0">
                <span className="block text-xs leading-snug tracking-[0.1em] text-ink uppercase">{t.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{t.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ZODIAC CRYSTAL COLLECTION */}
      <section className="border-y border-border bg-sand/50 py-20 md:py-24" aria-labelledby="zodiac-collection-heading">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow">New collection</p>
            <h2 id="zodiac-collection-heading" className="mt-3 text-3xl text-ink md:text-5xl">Zodiac Crystal Collection</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Explore crystal bracelets inspired by the 12 zodiac signs. Find your sign and choose a style that feels personal.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {zodiacItems.map((z) => (
              <figure key={z.sign} className="overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
                <img src={z.image} alt={`${z.sign} crystal bracelet`} loading="lazy" decoding="async" className="aspect-square w-full object-contain" />
                <figcaption className="py-2.5 text-center text-xs text-ink sm:text-sm">{z.sign} • {z.hindi}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="ink" size="xl" asChild>
              <Link to="/collections/zodiac-crystal-collection">
                Explore Collection <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TREE OF LIFE STORY */}
      {treeOfLife && (
        <section className="shell py-20 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <img
                src={treeOfLife.images[0]}
                alt={treeOfLife.name}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
              />
            </Reveal>
            <Reveal delay={80}>
              <p className="eyebrow">Tree of Life</p>
              <h2 className="mt-3 text-3xl text-ink md:text-5xl">A symbol of connection</h2>
              <span className="mt-5 block h-px w-12 bg-champagne" />
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                The Tree of Life has long been used as a symbol of growth, connection and new beginnings. Our
                interpretation brings that timeless symbolism together with colorful natural stones in a piece
                designed to be worn and remembered.
              </p>
              <Link
                to="/product/$slug"
                params={{ slug: treeOfLife.slug }}
                className="mt-8 inline-flex items-center gap-1.5 text-xs tracking-[0.14em] text-primary uppercase hover:opacity-70"
              >
                Discover the pendant <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}


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
    </>
  );
}
