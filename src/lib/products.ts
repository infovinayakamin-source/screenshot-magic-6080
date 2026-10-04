import braceletTurquoise from "@/assets/bracelet-turquoise.jpg";
import braceletChakra from "@/assets/bracelet-chakra.jpg";
import braceletEnergy from "@/assets/bracelet-energy.jpg";
import pendantTree from "@/assets/pendant-tree-of-life.jpg";
import pendantStone from "@/assets/pendant-stone.jpg";
import giftSet from "@/assets/gift-set.jpg";
import editorial from "@/assets/editorial.jpg";
import hero from "@/assets/hero.jpg";
import { zodiacItems, zodiacTitle } from "@/lib/zodiac";

export const BRAND = "ShivAmrit Healers";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: "Bracelets" | "Pendants" | "Gift Sets";
  collection: string[];
  stoneType: string;
  color: string;
  size: string;
  weight: string;
  rating: number;
  reviewCount: number;
  inventory: number;
  featured: boolean;
  bestseller: boolean;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Turquoise Natural Stone Bracelet",
    slug: "turquoise-natural-stone-bracelet",
    shortDescription: "Ocean-toned stone beads with fine gold-tone spacers.",
    description:
      "Hand-strung turquoise-toned natural stone beads, finished with delicate gold-tone spacers on a soft elastic core. Each bead carries its own veining, so no two bracelets are identical. Traditionally associated with calm and clarity, it is made for everyday wear and quiet intention.",
    price: 1899,
    compareAtPrice: 2799,
    images: [braceletTurquoise, hero, editorial],
    category: "Bracelets",
    collection: ["crystal-bracelets", "healing-inspired"],
    stoneType: "Natural turquoise-toned stone",
    color: "Turquoise",
    size: "8mm beads · 18cm stretch fit",
    weight: "24g",
    rating: 4.8,
    reviewCount: 214,
    inventory: 32,
    featured: true,
    bestseller: true,
  },
  {
    id: "p2",
    name: "Tree of Life Chakra Pendant",
    slug: "tree-of-life-chakra-pendant",
    shortDescription: "Wire-wrapped tree with seven coloured natural stones.",
    description:
      "A finely wire-wrapped Tree of Life set with seven coloured natural stones, each chosen for its symbolic meaning. Suspended on a slim gold-tone chain, it is a quiet reminder of growth, roots and intention.",
    price: 2299,
    compareAtPrice: 3199,
    images: [pendantTree, hero, editorial],
    category: "Pendants",
    collection: ["tree-of-life", "chakra-jewelry", "crystal-pendants"],
    stoneType: "Mixed natural chakra stones",
    color: "Multicolour",
    size: "32mm pendant · 45cm chain",
    weight: "12g",
    rating: 4.9,
    reviewCount: 168,
    inventory: 21,
    featured: true,
    bestseller: true,
  },
  {
    id: "p3",
    name: "Crystal Energy Bracelet",
    slug: "crystal-energy-bracelet",
    shortDescription: "Clear quartz and amazonite in a soft, luminous mix.",
    description:
      "Translucent clear quartz paired with soft amazonite beads for a light, luminous everyday piece. Intention-inspired and easy to layer with watches and fine chains.",
    price: 1699,
    compareAtPrice: 2299,
    images: [braceletEnergy, braceletTurquoise, editorial],
    category: "Bracelets",
    collection: ["crystal-bracelets", "healing-inspired"],
    stoneType: "Clear quartz · Amazonite",
    color: "Sage",
    size: "10mm beads · 18cm stretch fit",
    weight: "28g",
    rating: 4.7,
    reviewCount: 132,
    inventory: 40,
    featured: false,
    bestseller: true,
  },
  {
    id: "p4",
    name: "Seven Chakra Bracelet",
    slug: "seven-chakra-bracelet",
    shortDescription: "Lava stone base with seven coloured natural stones.",
    description:
      "Matte lava stone beads framing seven coloured natural stones, each with its own symbolic meaning. A grounded, understated piece for mindfulness and personal rituals.",
    price: 1599,
    compareAtPrice: 2199,
    images: [braceletChakra, braceletTurquoise, editorial],
    category: "Bracelets",
    collection: ["chakra-jewelry", "crystal-bracelets"],
    stoneType: "Lava stone · Mixed natural stones",
    color: "Multicolour",
    size: "8mm beads · 18cm stretch fit",
    weight: "26g",
    rating: 4.6,
    reviewCount: 96,
    inventory: 0,
    featured: false,
    bestseller: true,
  },
  {
    id: "p5",
    name: "Natural Stone Pendant",
    slug: "natural-stone-pendant",
    shortDescription: "A raw quartz point capped in warm gold tone.",
    description:
      "An uncut quartz point set in a warm gold-tone cap on a fine chain. Raw, sculptural and deliberately imperfect — a modern take on natural stone jewellery.",
    price: 1999,
    images: [pendantStone, pendantTree, editorial],
    category: "Pendants",
    collection: ["crystal-pendants"],
    stoneType: "Raw clear quartz",
    color: "Champagne",
    size: "28mm pendant · 45cm chain",
    weight: "10g",
    rating: 4.7,
    reviewCount: 74,
    inventory: 18,
    featured: true,
    bestseller: false,
  },
  {
    id: "p6",
    name: "Crystal Gift Set",
    slug: "crystal-gift-set",
    shortDescription: "Bracelet, pendant and care card in premium packaging.",
    description:
      "A bracelet and pendant presented together in our signature beige gift box with a ribbon and a care and meaning card. A thoughtful gifting option, ready to give as it arrives.",
    price: 3499,
    compareAtPrice: 4599,
    images: [giftSet, pendantStone, editorial],
    category: "Gift Sets",
    collection: ["gift-collection", "crystal-pendants"],
    stoneType: "Clear quartz · Mixed natural stones",
    color: "Ivory",
    size: "One size",
    weight: "120g with packaging",
    rating: 4.9,
    reviewCount: 58,
    inventory: 12,
    featured: true,
    bestseller: true,
  },
  ...zodiacItems.map(
    (z): Product => ({
      id: `z-${z.sign.toLowerCase()}`,
      name: zodiacTitle(z),
      slug: z.slug,
      description: z.description,
      shortDescription: z.shortDescription,
      price: z.price ?? 0,
      images: [z.image],
      category: "Bracelets",
      collection: ["zodiac-crystal-collection", "crystal-bracelets", "healing-inspired"],
      stoneType: "Natural stone",
      color: z.colours,
      size: "8 mm beads, elastic stretch",
      weight: "",
      rating: 0,
      reviewCount: 0,
      inventory: z.inventory ?? 0,
      featured: false,
      bestseller: false,
    }),
  ),
];

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "zodiac-crystal-collection",
    name: "Zodiac Crystal Bracelets",
    description: "Natural stone bracelets inspired by your zodiac sign.",
    image: zodiacItems[0]?.image ?? braceletTurquoise,
  },
];

export const lifestyleImages = [
  braceletTurquoise,
  pendantTree,
  editorial,
  giftSet,
  braceletEnergy,
  braceletChakra,
];

export const heroImage = hero;
export const editorialImage = editorial;

export const formatINR = (value: number) =>
  "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const discountPercent = (p: Product) =>
  p.compareAtPrice ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const productsInCollection = (slug: string) =>
  products.filter((p) => p.collection.includes(slug));

export const FREE_SHIPPING_THRESHOLD = 2500;
