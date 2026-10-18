import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { StorefrontHero } from '@/components/StorefrontHero';
import { ProductCard } from '@/components/ProductCard';
import { QuickView } from '@/components/QuickView';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CategoryRow, SectionHeading, CollectionBanners, StoneCategories, ProductShowcase, AssuranceStrip, SampleReviews, InstagramStrip, ServiceBenefits, InformationalArea } from '@/components/StorefrontSections';
import { storefrontContent } from '@/lib/storefront-content';
import { useProducts, type Product } from '@/lib/products';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'ShivAmrit Healers — Crystal Bracelets | ALIGN • HEAL • EVOLVE' },
    { name: 'description', content: 'Explore ShivAmrit Healers zodiac crystal bracelets. Shop by sign or stone, compare designs and find a thoughtful gift.' },
    { property: 'og:title', content: 'ShivAmrit Healers — Crystal Bracelets' },
    { property: 'og:description', content: 'ALIGN • HEAL • EVOLVE. Discover zodiac-inspired natural stone bracelets and meaningful gifts.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Home,
});
function Home() {
  const products = useProducts();
  const [quick, setQuick] = useState<Product | null>(null);
  return <div className="reference-storefront">
    <StorefrontHero />
    <CategoryRow products={products} />
    <CategoryRow products={products} seasonal />
    <section id="gift-guide" className="reference-section gift-section"><div className="shell"><SectionHeading title="Gift Guide" subtitle="A little meaning for someone special." /><div className="gift-guide-tabs"><span>Zodiac Crystal Bracelets</span><span>Natural Stones</span><span>Personal Gifting</span></div><div className="reference-product-grid">{products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} imageFit="cover" onQuickView={setQuick} />)}</div></div></section>
    <CollectionBanners products={products} />
    <StoneCategories products={products} />
    <div className="reference-divider">{storefrontContent.tagline}<span>•</span>ZODIAC CRYSTAL BRACELETS<span>•</span>CHOSEN WITH MEANING</div>
    <ProductShowcase products={products.slice(0, 5)} onQuickView={setQuick} />
    <ProductShowcase products={products.slice(5, 10)} reverse onQuickView={setQuick} />
    <AssuranceStrip />
    <section className="reference-section"><div className="shell"><SectionHeading title="ShivAmrit Favourites" subtitle="Natural colours. Personal stories. Your everyday bracelet." /><div className="reference-product-grid">{products.slice(2, 6).map(product => <ProductCard key={product.id} product={product} onQuickView={setQuick} />)}</div></div></section>
    <SampleReviews products={products} />
    <InstagramStrip products={products} />
    <ServiceBenefits />
    <InformationalArea />
    <section className="shell homepage-faq"><SectionHeading title="Frequently Asked Questions" /><Accordion type="single" collapsible>{storefrontContent.faqs.map((faq, i) => <AccordionItem key={faq.question} value={`faq-${i}`}><AccordionTrigger>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></section>
    <QuickView product={quick} onOpenChange={open => { if (!open) setQuick(null); }} />
  </div>;
}
