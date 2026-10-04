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

export const products: Product[] = zodiacItems.map(
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
);

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
    image: zodiacItems[0]?.image ?? hero,
  },
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
