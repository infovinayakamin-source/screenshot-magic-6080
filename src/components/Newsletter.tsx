import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function Newsletter() {
  return (
    <section className="shell py-16 md:py-20">
      <Reveal className="border-y border-gold/60 bg-background px-6 py-14 text-center md:px-16 md:py-20">
         <p className="eyebrow">Explore</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl text-ink md:text-5xl">
          Find your next favourite piece
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
           Discover a bracelet inspired by your sign and make it your own.
        </p>
         <Button asChild variant="ink" size="xl" className="mt-8"><Link to="/collections/zodiac-crystal-collection">Shop zodiac bracelets</Link></Button>
      </Reveal>
    </section>
  );
}
