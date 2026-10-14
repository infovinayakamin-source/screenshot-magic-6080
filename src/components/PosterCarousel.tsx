import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useProducts } from "@/lib/products";

const posterCopy = [
  { sign: "Aries", eyebrow: "The zodiac collection", title: "A little meaning, worn every day.", copy: "Discover the Aries crystal bracelet.", action: "Explore Aries" },
  { sign: "Taurus", eyebrow: "Find your sign", title: "Your sign. Your everyday piece.", copy: "Discover the Taurus crystal bracelet.", action: "Explore Taurus" },
  { sign: "Pisces", eyebrow: "Made personal", title: "A colour story that feels like you.", copy: "Discover the Pisces crystal bracelet.", action: "Explore Pisces" },
];

export function PosterCarousel() {
  const products = useProducts();
  const posters = posterCopy.flatMap((poster) => {
    const product = products.find((item) => item.sign === poster.sign && item.images[0]);
    return product ? [{ ...poster, product }] : [];
  });
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);

  useEffect(() => {
    if (!api || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), 6500);
    return () => window.clearInterval(timer);
  }, [api, paused]);

  return (
    <section aria-label="Zodiac bracelet posters" className="border-y border-gold/40 bg-navy text-navy-foreground" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <Carousel opts={{ loop: true }} setApi={setApi} aria-label="Featured bracelets">
        <CarouselContent className="ml-0">
          {posters.map(({ product, eyebrow, title, copy, action }, index) => (
            <CarouselItem key={product.slug} className="pl-0">
              <div className="shell grid min-h-[440px] items-center gap-5 py-9 md:min-h-[500px] md:grid-cols-2 md:gap-12 md:py-12">
                <div className="order-2 pb-12 md:order-1 md:pb-0">
                  <p className="text-xs font-medium uppercase text-gold">{eyebrow}</p>
                  <h2 className="mt-5 max-w-xl text-4xl leading-none text-navy-foreground sm:text-5xl lg:text-6xl">{title}</h2>
                  <p className="mt-5 text-sm text-navy-foreground/80 md:text-base">{copy}</p>
                  <Button asChild variant="quiet" size="xl" className="mt-7 border-gold bg-gold text-gold-foreground hover:bg-gold/90 hover:text-gold-foreground">
                    <Link to="/product/$slug" params={{ slug: product.slug }}>{action}<ArrowRight /></Link>
                  </Button>
                </div>
                <div className="order-1 mx-auto w-full max-w-[360px] md:order-2 md:max-w-[460px]">
                  <img src={product.images[0]} alt={`${product.sign} zodiac crystal bracelet`} className="aspect-[1.7] w-full object-contain md:aspect-square" loading="lazy" decoding="async" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="shell pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-between md:bottom-9">
          <div className="pointer-events-auto flex gap-2" aria-label="Select poster">
            {posters.map(({ product }, index) => (
              <Button key={product.slug} variant="ghost" size="icon" onClick={() => api?.scrollTo(index)} aria-label={`Show ${product.sign} poster`} aria-current={selected === index ? "true" : undefined} className="size-8 rounded-full hover:bg-navy-foreground/10">
                <span className={`block h-1.5 rounded-full transition-all ${selected === index ? "w-5 bg-gold" : "w-1.5 bg-navy-foreground/60"}`} />
              </Button>
            ))}
          </div>
          <div className="pointer-events-auto flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full border-gold/60 bg-navy text-gold hover:bg-gold hover:text-gold-foreground" onClick={() => api?.scrollPrev()} aria-label="Previous poster"><ArrowLeft /></Button>
            <Button variant="outline" size="icon" className="rounded-full border-gold/60 bg-navy text-gold hover:bg-gold hover:text-gold-foreground" onClick={() => api?.scrollNext()} aria-label="Next poster"><ArrowRight /></Button>
          </div>
        </div>
      </Carousel>
    </section>
  );
}