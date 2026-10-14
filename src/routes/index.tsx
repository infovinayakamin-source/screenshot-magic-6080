import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Gem, Gift, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StorefrontHero } from "@/components/StorefrontHero";
import { ProductCard } from "@/components/ProductCard";
import { PosterCarousel } from "@/components/PosterCarousel";
import { QuickView } from "@/components/QuickView";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { useProducts, type Product } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ShivAmrit Healers — Zodiac Crystal Bracelets" },
    { name: "description", content: "Explore ShivAmrit Healers zodiac crystal bracelets. Natural stone jewellery for everyday style, personal meaning and thoughtful gifting." },
    { property: "og:title", content: "ShivAmrit Healers — Zodiac Crystal Bracelets" },
    { property: "og:description", content: "Your sign. Your story. Your bracelet. Discover the ShivAmrit zodiac crystal collection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  const products = useProducts();
  const [view, setView] = useState<"featured" | "newest">("featured");
  const [quick, setQuick] = useState<Product | null>(null);
  const signRail = useRef<HTMLDivElement>(null);
  const giftRail = useRef<HTMLDivElement>(null);
  const sorted = [...products].sort((a, b) => view === "newest" ? b.createdAt.localeCompare(a.createdAt) : Number(b.featured) - Number(a.featured));
  const signs = products.filter((p, i) => products.findIndex((other) => other.sign === p.sign) === i);

  return <>
    <StorefrontHero />

    <section className="border-b border-border bg-background" aria-label="Collection highlights">
      <div className="shell grid grid-cols-2 gap-y-5 py-6 md:grid-cols-4 md:py-7">
        {[
          { icon: Gem, title: "Natural stone colours" },
          { icon: Sparkles, title: "Zodiac-inspired designs" },
          { icon: Gift, title: "Meaningful gifting" },
          { icon: ShieldCheck, title: "Online payment & COD" },
        ].map(({ icon: Icon, title }) => <div key={title} className="flex items-center justify-center gap-2.5 border-gold/30 px-2 text-xs text-navy md:border-r md:last:border-r-0"><Icon className="size-5 shrink-0 text-gold" strokeWidth={1.5} /><span>{title}</span></div>)}
      </div>
    </section>

    <section className="py-12 md:py-16" aria-labelledby="sign-heading">
      <div className="shell">
        <Reveal><div className="flex items-center justify-between gap-4">
          <div><p className="eyebrow">A little more personal</p><h2 id="sign-heading" className="mt-2 text-3xl text-navy md:text-4xl">Find your zodiac</h2></div>
          <div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="Previous zodiac signs" onClick={() => signRail.current?.scrollBy({ left: -380, behavior: "smooth" })}><ArrowLeft /></Button><Button variant="ghost" size="icon" aria-label="Next zodiac signs" onClick={() => signRail.current?.scrollBy({ left: 380, behavior: "smooth" })}><ArrowRight /></Button></div>
        </div></Reveal>
        <div ref={signRail} className="zodiac-rail mt-7 flex gap-5 overflow-x-auto pb-4 sm:gap-7">
          {signs.map((product) => <Link key={product.sign} to="/product/$slug" params={{ slug: product.slug }} className="group w-28 shrink-0 text-center md:w-36">
            <span className="block aspect-square overflow-hidden rounded-full border border-gold/40 bg-muted"><img src={product.images[0]} alt={`${product.sign} bracelet`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" /></span>
            <span className="mt-3 block text-sm font-medium text-navy">{product.sign}</span><span className="mt-1 block text-xs text-muted-foreground">{product.signHi}</span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-muted/40 py-12 md:py-16" aria-labelledby="featured-heading">
      <div className="shell">
        <Reveal className="text-center"><p className="eyebrow">The zodiac crystal collection</p><h2 id="featured-heading" className="mt-3 text-4xl text-navy md:text-5xl">A piece of your story</h2><p className="mt-3 text-sm text-muted-foreground">Your everyday companion, chosen by you.</p>
          <div className="mt-6 inline-flex gap-5 border-b border-border" role="group" aria-label="Product selection">
            <Button variant="ghost" aria-pressed={view === "featured"} onClick={() => setView("featured")} className={`rounded-none border-b-2 px-1 hover:bg-transparent ${view === "featured" ? "border-navy text-navy" : "border-transparent text-muted-foreground"}`}>Featured bracelets</Button>
            <Button variant="ghost" aria-pressed={view === "newest"} onClick={() => setView("newest")} className={`rounded-none border-b-2 px-1 hover:bg-transparent ${view === "newest" ? "border-navy text-navy" : "border-transparent text-muted-foreground"}`}>Newest additions</Button>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">{sorted.slice(0, 8).map((product, i) => <Reveal key={product.id} delay={(i % 4) * 70} className="min-w-0"><ProductCard product={product} imageFit="contain" onQuickView={setQuick} /></Reveal>)}</div>
        <div className="mt-10 text-center"><Button asChild variant="quiet" size="xl"><Link to="/collections/zodiac-crystal-collection">Explore all bracelets <ArrowRight /></Link></Button></div>
      </div>
    </section>

    <PosterCarousel />

    <section className="py-12 md:py-16" aria-labelledby="personal-heading">
      <div className="shell"><Reveal><div className="mb-8 text-center"><p className="eyebrow">Chosen with intention</p><h2 id="personal-heading" className="mt-3 text-4xl text-navy md:text-5xl">Small details. Personal meaning.</h2></div></Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { product: products[1], title: "A gift that feels personal", text: "For their sign. For their story.", action: "Find their bracelet" },
            { product: products[4] ?? products[0], title: "Make it your everyday", text: "Natural colours. Your own style.", action: "Find your bracelet" },
          ].map(({ product, title, text, action }, i) => product && <Reveal key={title} delay={i * 100}><Link to="/product/$slug" params={{ slug: product.slug }} className="editorial-tile group relative isolate block overflow-hidden bg-navy text-navy-foreground"><img src={product.images[0]} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="editorial-scrim absolute inset-0" /><div className="relative flex h-full flex-col justify-end p-6 md:p-8"><p className="mb-2 text-xs text-gold">{product.sign} · {product.signHi}</p><h3 className="max-w-xs text-3xl md:text-4xl">{title}</h3><p className="mt-2 text-sm text-navy-foreground/80">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-xs underline underline-offset-4">{action}<ArrowRight className="size-4" /></span></div></Link></Reveal>)}
        </div>
      </div>
    </section>

    <div className="meaning-marquee overflow-hidden border-y border-gold/30 bg-navy py-5 text-gold" aria-label="Natural stone jewellery. Personal meaning. Zodiac-inspired."><div className="marquee-track flex w-max items-center gap-10" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i} className="flex shrink-0 items-center gap-10 font-display text-2xl"><span>Natural stone jewellery</span><Sparkles className="size-4" /><span>Personal meaning</span><Sparkles className="size-4" /><span>Zodiac-inspired</span><Sparkles className="size-4" /></span>)}</div></div>

    <section className="py-12 md:py-16" aria-labelledby="gift-heading"><div className="shell">
      <Reveal><div className="flex items-end justify-between gap-3"><div><p className="eyebrow">The gift edit</p><h2 id="gift-heading" className="mt-2 text-3xl text-navy md:text-4xl">For someone special</h2></div><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="Previous gift bracelets" onClick={() => giftRail.current?.scrollBy({ left: -400, behavior: "smooth" })}><ArrowLeft /></Button><Button variant="ghost" size="icon" aria-label="Next gift bracelets" onClick={() => giftRail.current?.scrollBy({ left: 400, behavior: "smooth" })}><ArrowRight /></Button></div></div></Reveal>
      <div ref={giftRail} className="gift-rail mt-8 grid auto-cols-[72%] grid-flow-col gap-4 overflow-x-auto pb-4 sm:auto-cols-[38%] md:auto-cols-[28%] lg:auto-cols-[23%]">{products.slice(3, 10).map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuick} imageFit="contain" />)}</div>
    </div></section>

    <section className="border-y border-border bg-muted/40 py-14 md:py-20"><div className="shell"><Reveal className="mx-auto max-w-2xl text-center"><Heart className="mx-auto size-6 text-gold" strokeWidth={1.5} /><p className="eyebrow mt-5">The ShivAmrit story</p><h2 className="mt-3 text-4xl text-navy md:text-5xl">More than an accessory.<br />Something that feels like you.</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">We believe in the beauty of natural stone colours and the meaning you bring to them. Explore zodiac-inspired bracelets for everyday wear and thoughtful gifting.</p><Button variant="link" asChild className="mt-5"><Link to="/about">Our story <ArrowRight /></Link></Button></Reveal></div></section>
    <Newsletter />
    <QuickView product={quick} onOpenChange={(open) => { if (!open) setQuick(null); }} />
  </>;
}
