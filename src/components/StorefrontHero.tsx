import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export function StorefrontHero() {
  const products = useProducts();
  const slides = products.filter((p) => p.images[0]).slice(0, 3);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const index = active % Math.max(1, slides.length);
  const product = slides[index];

  useEffect(() => {
    if (slides.length < 2 || paused || hovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((n) => (n + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, hovered]);

  return (
    <section className="storefront-hero relative isolate overflow-hidden bg-navy text-navy-foreground" aria-label="ShivAmrit zodiac collection" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false); }}>
      {slides.map((slide, i) => (
        <div key={slide.id} className={cn("hero-photo absolute inset-0 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
          <img src={slide.images[0]} alt="" className="h-full w-full object-cover" fetchPriority={i === 0 ? "high" : undefined} loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div className="hero-scrim absolute inset-0" />
      <div className="shell relative z-10 flex h-full flex-col justify-center py-20">
        <div className="hero-copy max-w-xl">
          <p className="mb-5 text-xs font-medium uppercase text-gold">The zodiac crystal collection</p>
          <h1 className="text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">ShivAmrit<br />Healers</h1>
          <p className="mt-5 font-display text-2xl sm:text-3xl">Your sign. Your story. Your bracelet.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-foreground/80">Natural stone colours, personal meaning.<br />Discover the piece that feels like you.</p>
          <Button asChild size="xl" className="mt-7 rounded-none border-gold bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/collections/zodiac-crystal-collection">Explore bracelets <ArrowRight /></Link></Button>
        </div>
      </div>
      <div className="shell absolute inset-x-0 bottom-5 z-20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1" aria-label="Select featured bracelet">
          {slides.map((slide, i) => <Button key={slide.id} variant="ghost" size="icon" aria-label={`Show ${slide.sign} bracelet`} aria-current={i === index ? "true" : undefined} className="size-10 text-gold hover:bg-navy-foreground/10" onClick={() => setActive(i)}><span className={cn("h-0.5 transition-all duration-300", i === index ? "w-7 bg-gold" : "w-3 bg-navy-foreground/50")} /></Button>)}
          <Button variant="ghost" size="icon" aria-label={paused ? "Play slideshow" : "Pause slideshow"} className="text-navy-foreground hover:bg-navy-foreground/10" onClick={() => setPaused(!paused)}>{paused ? <Play className="size-3" /> : <Pause className="size-3" />}</Button>
        </div>
        <div className="flex items-center gap-3">
          {product && <Link to="/product/$slug" params={{ slug: product.slug }} className="hidden text-xs text-navy-foreground underline underline-offset-4 sm:block">{product.sign} · {product.signHi}</Link>}
          <Button variant="ghost" size="icon" aria-label="Previous featured bracelet" className="text-navy-foreground hover:bg-navy-foreground/10" onClick={() => setActive((index - 1 + slides.length) % Math.max(1, slides.length))}><ArrowLeft /></Button>
          <Button variant="ghost" size="icon" aria-label="Next featured bracelet" className="text-navy-foreground hover:bg-navy-foreground/10" onClick={() => setActive((index + 1) % Math.max(1, slides.length))}><ArrowRight /></Button>
        </div>
      </div>
    </section>
  );
}