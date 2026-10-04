import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Heart, ShieldCheck, Truck, ArrowRight, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/Newsletter";
import { FREE_SHIPPING_THRESHOLD, formatINR } from "@/lib/products";
import { ZODIAC_SIGNS, zodiacItems } from "@/lib/zodiac";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Zodiac Crystal Bracelets | ShivAmrit Healers" },
    { name: "description", content: "Explore ShivAmrit Healers zodiac crystal bracelets. Find your sign and discover natural stone jewellery for everyday style and personal intention." },
    { property: "og:title", content: "Zodiac Crystal Bracelets | ShivAmrit Healers" },
    { property: "og:description", content: "Find your zodiac sign and explore natural stone bracelets for everyday style and personal intention." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

const trust = [
  { icon: Gem, title: "Natural stone jewellery", detail: "Each piece has its own character" },
  { icon: Sparkles, title: "Made with intention", detail: "A personal symbol to carry" },
  { icon: ShieldCheck, title: "7-day returns", detail: "On unworn pieces" },
  { icon: Truck, title: "Free shipping", detail: `On orders above ${formatINR(FREE_SHIPPING_THRESHOLD)}` },
];

const intentions = [
  { icon: Sparkles, title: "Wealth & abundance", stones: "Pyrite · Citrine", description: "Traditionally associated with optimism and new possibilities." },
  { icon: ShieldCheck, title: "Protection & grounding", stones: "Tiger Eye · Black Tourmaline", description: "Symbols of steadiness and personal boundaries." },
  { icon: Heart, title: "Love & reflection", stones: "Rose Quartz", description: "A gentle reminder to make space for connection." },
];

function Home() {
  return <>
    <section className="relative isolate overflow-hidden border-b border-gold/40 bg-background">
      <img src={zodiacItems[0].image} alt="Aries zodiac crystal bracelet on a gold stand" className="absolute inset-0 -z-10 size-full object-cover object-center opacity-20 md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent_25%,black_90%)]" fetchPriority="high" />
      <div className="shell flex min-h-[440px] flex-col items-center justify-center py-16 text-center md:min-h-[540px] md:items-start md:text-left">
        <p className="text-xs tracking-[0.22em] text-navy uppercase">ShivAmrit Healers · Zodiac crystal bracelets</p>
        <h1 className="mt-5 max-w-2xl text-5xl leading-none text-navy sm:text-7xl lg:text-8xl">Wear your energy.</h1>
        <p className="mt-5 max-w-lg font-display text-xl italic text-ink md:text-2xl">A bracelet for your sign. A little meaning for every day.</p>
        <Button asChild variant="ink" size="xl" className="mt-8">
          <Link to="/collections/zodiac-crystal-collection">Find your zodiac sign <ArrowRight /></Link>
        </Button>
      </div>
    </section>

    <section className="border-b border-gold/40 bg-background" aria-label="Shopping information">
      <div className="shell grid grid-cols-2 gap-6 py-6 md:grid-cols-4 md:divide-x md:divide-gold/40 md:py-8">
        {trust.map(({ icon: Icon, title, detail }) => <div key={title} className="text-center">
          <Icon className="mx-auto size-6 text-navy" strokeWidth={1.5} />
          <p className="mt-2 text-xs font-medium text-ink">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>)}
      </div>
    </section>

    <section className="py-16 md:py-20" aria-labelledby="sign-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow">The zodiac collection</p><h2 id="sign-heading" className="mt-2 text-4xl text-navy md:text-5xl">Shop by zodiac sign</h2><p className="mt-3 text-sm text-muted-foreground">Choose your sign to see its bracelet.</p></div>
          <Link to="/collections/zodiac-crystal-collection" className="inline-flex items-center gap-2 text-sm text-navy underline underline-offset-4">View all bracelets <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {ZODIAC_SIGNS.map((sign) => {
            const item = zodiacItems.find((z) => z.sign === sign.en);
            return item ? <Link key={sign.en} to="/product/$slug" params={{ slug: item.slug }} className="group min-w-0 border border-gold/40 bg-background p-2 transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <img src={item.image} alt={`${item.sign} crystal bracelet`} className="aspect-square w-full object-contain" loading="lazy" decoding="async" />
              <span className="block pt-3 pb-2 text-center text-sm text-navy">{item.sign} <span className="text-muted-foreground">· {item.hindi}</span></span>
            </Link> : <div key={sign.en} className="flex aspect-square flex-col items-center justify-center border border-dashed border-gold/40 bg-background p-3 text-center">
              <span className="font-display text-xl text-navy">{sign.en}</span><span className="text-xs text-muted-foreground">{sign.hi}</span><span className="mt-2 text-xs text-muted-foreground">Coming soon</span>
            </div>;
          })}
        </div>
      </div>
    </section>

    <section className="border-y border-gold/40 bg-background py-16 md:py-20" aria-labelledby="intentions-heading">
      <div className="shell">
        <p className="eyebrow">Explore the symbolism</p><h2 id="intentions-heading" className="mt-2 text-4xl text-navy md:text-5xl">Choose an intention</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Ideas from crystal traditions, not a claim about the stones in a specific bracelet. Check each piece for its actual materials.</p>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {intentions.map(({ icon: Icon, title, stones, description }) => <div key={title} className="border-t border-gold pt-5">
            <Icon className="size-6 text-navy" strokeWidth={1.4} /><h3 className="mt-4 text-2xl text-navy">{title}</h3><p className="mt-1 text-xs tracking-[0.12em] text-primary uppercase">{stones}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>)}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20" aria-labelledby="story-heading">
      <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div><p className="eyebrow">The ShivAmrit story</p><h2 id="story-heading" className="mt-2 text-4xl text-navy md:text-5xl">Meaning in the little things</h2><p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">Our bracelets pair natural stone colours with the symbolism of the zodiac. Choose the one that feels like you, wear it as a reminder of your intention, and care for it so it can accompany your everyday moments.</p><Button variant="quiet" asChild className="mt-7"><Link to="/about">Our story <ArrowRight /></Link></Button></div>
        <ol className="divide-y divide-border border-y border-border">
          <li className="flex gap-5 py-5"><span className="font-display text-3xl text-gold">01</span><div><h3 className="text-xl text-navy">Find your sign</h3><p className="mt-1 text-sm text-muted-foreground">Explore your zodiac bracelet and its individual colours.</p></div></li>
          <li className="flex gap-5 py-5"><span className="font-display text-3xl text-gold">02</span><div><h3 className="text-xl text-navy">Wear with intention</h3><p className="mt-1 text-sm text-muted-foreground">Make it part of a personal moment or give it to someone special.</p></div></li>
          <li className="flex gap-5 py-5"><span className="font-display text-3xl text-gold">03</span><div><h3 className="text-xl text-navy">Keep it close</h3><p className="mt-1 text-sm text-muted-foreground">A thoughtful accent for your everyday style.</p></div></li>
        </ol>
      </div>
    </section>

    <section className="border-y border-border bg-navy py-14 text-navy-foreground md:py-20" aria-labelledby="guide-heading">
      <div className="shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><Gift className="size-6 text-gold" strokeWidth={1.4} /><h2 id="guide-heading" className="mt-3 text-3xl text-gold md:text-4xl">Which bracelet is right for me?</h2><p className="mt-2 max-w-lg text-sm text-navy-foreground/80">Start with your zodiac sign, then consider the colours and fit that feel right to you.</p></div>
        <Button asChild size="xl" className="border border-gold bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/faq" hash="choose">Read the guide <ArrowRight /></Link></Button>
      </div>
    </section>
    <Newsletter />
  </>;
}
