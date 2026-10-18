import { Link } from '@tanstack/react-router';
import { Gem, Gift, Heart, Search, ShoppingBag, SlidersHorizontal, Sparkles, BookOpen, HelpCircle, Eye, CircleCheck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { storefrontContent } from '@/lib/storefront-content';
import type { Product } from '@/lib/products';
import amethyst from '@/assets/crystal-amethyst.jpg';
import citrine from '@/assets/crystal-citrine.jpg';
import garnet from '@/assets/crystal-garnet.jpg';
import lapis from '@/assets/crystal-lapis-lazuli.jpg';
import pyrite from '@/assets/crystal-pyrite.jpg';
import rose from '@/assets/crystal-rose-quartz.jpg';
import selenite from '@/assets/crystal-selenite.jpg';
import tiger from '@/assets/crystal-tiger-eye.jpg';

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="reference-section-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}
export function CategoryRow({ products, seasonal = false }: { products: Product[]; seasonal?: boolean }) {
  return <section className="reference-section category-section"><div className="shell"><SectionHeading title={seasonal ? storefrontContent.seasonalHeading : 'Our Category'} subtitle={seasonal ? storefrontContent.seasonalSubtitle : 'Find your sign. Find your stone.'} /><div className="circle-category-row">{products.slice(seasonal ? 5 : 0, seasonal ? 11 : 6).map(product => <Link key={product.id} to="/collections/zodiac-crystal-collection" search={{ sign: product.signSlug }}><img src={product.images[0]} alt={`${product.sign} crystal bracelet`} width={200} height={200} loading="lazy" /><h3>{product.sign} Bracelets</h3><p>{product.signHi} · {product.stones.split(',').slice(0, 2).join(',')}</p></Link>)}</div></div></section>;
}
export function CollectionBanners({ products }: { products: Product[] }) {
  const labels = ['Zodiac Crystal Bracelets', 'A Thoughtful Gift', 'Everyday Stone Jewellery'];
  return <section className="reference-section"><div className="shell"><SectionHeading title="Shop by Collection" /><div className="collection-banner-grid">{labels.map((title, i) => { const p = products[i * 3]; return p && <Link key={title} to="/collections/zodiac-crystal-collection" search={i ? { sign: p.signSlug } : {}} className="collection-banner"><img src={p.images[0]} alt={p.name} width={600} height={360} loading="lazy" /><div><h3>{title}</h3><p>{i === 0 ? 'Your sign, your story.' : i === 1 ? 'A little more personal.' : 'Colours to make your own.'}</p><span>Shop now →</span></div></Link>; })}</div></div></section>;
}
const stones = [
  { name: 'Selenite', image: selenite }, { name: 'Rose Quartz', image: rose }, { name: 'Pyrite', image: pyrite }, { name: 'Citrine', image: citrine }, { name: 'Amethyst', image: amethyst },
  { name: 'Mixed Crystals', image: null }, { name: 'Lapis Lazuli', image: lapis }, { name: 'Tiger Eye', image: tiger }, { name: 'Clear Quartz', image: null }, { name: 'Garnet', image: garnet },
];
export function StoneCategories({ products }: { products: Product[] }) {
  return <section className="reference-section stone-section"><div className="shell"><SectionHeading title="Shop by Stone" /><div className="stone-category-grid">{stones.map(stone => <Link key={stone.name} to="/shop" search={{ stone: stone.name === 'Mixed Crystals' ? undefined : stone.name }}><img src={stone.image ?? products.find(p => stone.name === 'Mixed Crystals' || p.stones.toLowerCase().includes('clear quartz'))?.images[0] ?? selenite} alt={stone.image ? `${stone.name} stone — illustrative category photograph` : `${stone.name} bracelet design`} width={200} height={160} loading="lazy" /><h3>{stone.name}</h3></Link>)}</div></div></section>;
}
export function ProductShowcase({ products, reverse = false, onQuickView }: { products: Product[]; reverse?: boolean; onQuickView: (product: Product) => void }) {
  const feature = products[0];
  return <section className="reference-section showcase-section" aria-label={reverse ? 'The gifting edit' : 'The zodiac edit'}><div className={`shell product-showcase ${reverse ? 'showcase-reverse' : ''}`}>
    {feature && <Link className="showcase-feature" to="/product/$slug" params={{ slug: feature.slug }}><img src={feature.images[0]} alt={feature.name} width={640} height={640} loading="lazy" /><span>{reverse ? 'A gift that feels personal' : 'Your sign. Your bracelet.'}<small>Explore the edit →</small></span></Link>}
    <div className="showcase-products">{products.slice(1, 5).map(p => <ProductCard key={p.id} product={p} onQuickView={onQuickView} imageFit="cover" />)}</div>
  </div></section>;
}
export const assurances = [
  { icon: Eye, title: 'Real Product Photos', copy: 'Explore each listed design.' },
  { icon: Gem, title: 'Stone Information', copy: 'Know the stones in your bracelet.' },
  { icon: Sparkles, title: 'Zodiac Inspired', copy: 'Find a sign that feels personal.' },
  { icon: ShoppingBag, title: 'Easy Browsing', copy: 'Keep your choices in one cart.' },
  { icon: Gift, title: 'Thoughtful Gifting', copy: 'Choose with someone in mind.' },
  { icon: HelpCircle, title: 'Product Enquiries', copy: 'Ask about the details that matter.' },
];
export function AssuranceStrip() {
  return <section className="reference-section assurance-section"><div className="shell"><div className="assurance-heading"><Sparkles aria-hidden="true" /><div><p>The ShivAmrit</p><h2>Assurance</h2></div><Sparkles aria-hidden="true" /></div><div className="assurance-grid">{assurances.map(({ icon: Icon, title, copy }) => <div key={title}><span className="assurance-icon"><Icon strokeWidth={1.3} /></span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>;
}
export function SampleReviews({ products }: { products: Product[] }) {
  return <section className="reference-section review-section"><div className="shell"><SectionHeading title="Customer Says!" subtitle="Sample content · real customer reviews have not been supplied." /><div className="review-grid">{[
    { title: 'A personal choice', text: '“A bracelet chosen for its colours and zodiac connection — a small detail with a personal story.”' },
    { title: 'A thoughtful gift', text: '“A birthday gift inspired by their sign, with natural stone colours that suit their everyday style.”' },
    { title: 'Everyday inspiration', text: '“A simple piece to wear with favourite jewellery and a reminder of an intention that matters.”' },
  ].map((review, i) => <article key={review.title}><span className="sample-review-label">Illustrative sample — not a customer review</span><h3>{review.title}</h3><p>{review.text}</p>{products[i] && <Link to="/product/$slug" params={{ slug: products[i].slug }} className="review-product"><img src={products[i].images[0]} alt={products[i].name} width={48} height={48} loading="lazy" /><span>{products[i].name}<small>Explore bracelet</small></span></Link>}</article>)}</div></div></section>;
}
export function InstagramStrip({ products }: { products: Product[] }) {
  return <section className="reference-section instagram-section"><div className="shell"><SectionHeading title="#Instagram" /><div className="instagram-grid">{products.slice(0, 6).map(p => <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }}><img src={p.images[0]} alt={`${p.sign} bracelet from our catalogue`} width={250} height={250} loading="lazy" /></Link>)}</div></div></section>;
}
export function ServiceBenefits() {
  return <section className="shell service-benefits" aria-label="Shopping details">{[
    { icon: Search, title: 'Find Your Sign', text: 'Browse zodiac designs in English and Hindi.' },
    { icon: SlidersHorizontal, title: 'Your Kind of Stone', text: 'Compare colours, stones and current prices.' },
    { icon: BookOpen, title: 'Read the Details', text: 'Explore photographs and product information.' },
    { icon: Heart, title: 'Choose with Meaning', text: 'Everyday jewellery and thoughtful gifting.' },
  ].map(({ icon: Icon, title, text }) => <div key={title}><Icon strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></div>)}</section>;
}
export function InformationalArea() {
  return <section className="shell storefront-information" aria-label="Crystal shopping guide">{storefrontContent.articles.map(article => <article key={article.title}><h2>{article.title}</h2>{article.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{'bullets' in article && article.bullets && <ul>{article.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}</article>)}</section>;
}
