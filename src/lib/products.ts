import { useLoaderData } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodiacItems } from "@/lib/zodiac";
import { getCatalog } from "@/lib/catalog.functions";

export const BRAND = "ShivAmrit Healers";

export type StockStatus = "in" | "low" | "out";

export type Product = {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  shortDescription: string;
  productInfo: string;
  price: number;
  compareAtPrice?: number | undefined;
  images: string[];
  category: "Bracelets" | "Pendants" | "Gift Sets";
  collection: string[];
  stoneType: string;
  stones: string;
  color: string;
  size: string;
  weight: string;
  rating: number;
  reviewCount: number;
  inventory: number;
  stockStatus: StockStatus;
  featured: boolean;
  bestseller: boolean;
  sign: string;
  signHi: string;
  symbol: string;
  signSlug: string;
  createdAt: string;
};

export const catalogQuery = {
  queryKey: ["catalog"] as const,
  queryFn: () => getCatalog(),
  staleTime: 15_000,
};

/** Live catalogue from the database. Seeded by the root loader so SSR has it. */
export function useProducts(): Product[] {
  const initialCatalog = useLoaderData({ from: "__root__" }) as { products: Product[] } | undefined;
  const { data } = useQuery({ ...catalogQuery, initialData: initialCatalog });
  return data?.products ?? [];
}

export type Collection = { slug: string; name: string; description: string; image: string };

export const collections: Collection[] = [
  {
    slug: "zodiac-crystal-collection",
    name: "Zodiac Crystal Bracelets",
    description: "Natural stone bracelets inspired by your zodiac sign.",
    image: zodiacItems[0]?.image ?? "",
  },
];

export const formatINR = (value: number) =>
  "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const discountPercent = (p: Product) =>
  p.compareAtPrice ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0;

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

export const FREE_SHIPPING_THRESHOLD = 2500;
