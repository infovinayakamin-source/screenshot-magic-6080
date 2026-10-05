import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem, Heart, ShieldCheck, Truck, ArrowRight, Sparkles, Gift, PackageCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { PosterCarousel } from "@/components/PosterCarousel";
import { products } from "@/lib/products";
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
    <section className="border-b border-border bg-sand/50">
      <div className="shell grid items-center gap-8 py-9 md:min-h-[540px] md:grid-cols-2 md:gap-12 md:py-12 lg:min-h-[610px]">
        <div className="order-2 md:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-background px-4 py-2 text-xs font-medium text-navy"><span className="size-2 rounded-full bg-gold" /> ShivAmrit Healers · Zodiac crystal bracelets</p>
          <h1 className="mt-6 max-w-xl text-5xl leading-[0.92] text-navy sm:text-7xl lg:text-8xl">Wear your energy.</h1>
          <p className="mt-5 max-w-lg font-display text-2xl text-ink md:text-3xl">A bracelet for your sign. A little meaning for every day.</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">Explore natural stone colours inspired by the zodiac. Choose a piece that feels personal to you.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="ink" size="xl" className="rounded-full"><Link to="/collections/zodiac-crystal-collection">Shop bracelets <ArrowRight /></Link></Button>
            <Button asChild variant="quiet" size="xl" className="rounded-full"><Link to="/about">Our story</Link></Button>
          </div>
          <div className="mt-8 flex gap-10 border-t border-gold/40 pt-5 text-navy">
            <div><strong className="block font-display text-3xl">11</strong><span className="text-xs text-muted-foreground">Zodiac bracelets</span></div>
            <div><strong className="block font-display text-3xl">₹999</strong><span className="text-xs text-muted-foreground">Each piece</span></div>
          </div>
        </div>
        <div className="order-1 relative md:order-2">
          <HeroRotator />
          <div className="absolute -bottom-3 left-4 rounded-[8px] border border-gold/40 bg-background px-4 py-3 shadow-soft md:-left-4"><span className="block text-xs text-muted-foreground">Explore the collection</span><strong className="font-display text-lg text-navy">Find your sign</strong></div>
        </div>
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

    <PosterCarousel />

    <section className="bg-sand/50 py-16 md:py-20" aria-labelledby="featured-heading">
      <div className="shell">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">The collection</p><h2 id="featured-heading" className="mt-2 text-4xl text-navy md:text-5xl">Zodiac bracelets</h2><p className="mt-2 text-sm text-muted-foreground">Your sign, your everyday piece.</p></div><Link to="/collections/zodiac-crystal-collection" className="shrink-0 text-sm text-navy underline underline-offset-4">See all <ArrowRight className="inline size-4" /></Link></div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} imageFit="contain" />)}</div>
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

    <section className="bg-sand/50 py-16 md:py-20" aria-labelledby="story-heading">
      <div className="shell">
        <h2 id="story-heading" className="text-4xl text-navy md:text-5xl">How we work</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">Discover bracelets inspired by your zodiac sign. Choose by colour and meaning, then make your selection your own.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Gem, title: "Explore your sign", text: "Browse the zodiac collection to find your bracelet." },
            { icon: Sparkles, title: "Look closer", text: "See the real product photo, colours and details of each piece." },
            { icon: ShoppingBag, title: "Choose your quantity", text: "Select how many you need and add them to your bag." },
            { icon: PackageCheck, title: "Place your order", text: "Choose online payment or cash on delivery at checkout." },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-[8px] border border-border bg-background p-5 shadow-soft md:p-7"><span className="grid size-11 place-items-center rounded-full bg-sand text-navy"><Icon size={21} strokeWidth={1.5} /></span><h3 className="mt-5 text-2xl text-navy">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
        </div>
        <div className="mt-12 grid gap-8 rounded-[8px] border border-border bg-background p-6 md:grid-cols-3 md:p-9">
          <div><Gem className="size-6 text-navy" strokeWidth={1.5} /><h3 className="mt-4 text-2xl text-navy">What we offer</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Zodiac-inspired natural stone bracelets, one design for each available sign.</p></div>
          <div><Heart className="size-6 text-navy" strokeWidth={1.5} /><h3 className="mt-4 text-2xl text-navy">Make it personal</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose the colours and symbolism that feel meaningful to you.</p></div>
          <div><Truck className="size-6 text-navy" strokeWidth={1.5} /><h3 className="mt-4 text-2xl text-navy">Delivery</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}. Shipping is ₹99 below that amount.</p></div>
        </div>
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
