import { Button } from '@/components/ui/button';
import { storefrontContent } from '@/lib/storefront-content';
import studio from '@/assets/storefront-studio.jpg';

export function StorefrontHero() {
  return <section className="reference-hero" aria-label="ShivAmrit crystal bracelets">
    <img src={studio} alt="Illustrative gemstone bracelet-making scene with colourful beads on a jeweller’s table" width={1920} height={640} fetchPriority="high" className="reference-hero-photo" />
    <div className="reference-hero-shade" />
    <div className="shell reference-hero-inner">
      <h1>{storefrontContent.heroHeading}</h1>
      <p className="hero-tagline">{storefrontContent.tagline}</p>
      <p className="hero-description">{storefrontContent.heroSubtitle}</p>
      <Button variant="sunrise" onClick={() => document.getElementById('gift-guide')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Shop now</Button>
    </div>
  </section>;
}
