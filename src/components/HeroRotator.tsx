import { useEffect, useState } from "react";
import { zodiacItems } from "@/lib/zodiac";

const slides = zodiacItems.slice(0, 6);

export function HeroRotator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[1.45] w-full rounded-[8px] border border-gold/40 bg-background md:aspect-[0.96]" aria-label="Featured zodiac bracelets">
      {slides.map((item, index) => (
        <img
          key={item.slug}
          src={item.image}
          alt={`${item.sign} zodiac crystal bracelet on a gold stand`}
          className="absolute inset-0 h-full w-full rounded-[8px] object-contain transition-opacity duration-700"
          style={{ opacity: index === active ? 1 : 0 }}
          fetchPriority={index === 0 ? "high" : undefined}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
      <span className="sr-only" aria-live="polite">{slides[active]?.sign} zodiac bracelet</span>
    </div>
  );
}
