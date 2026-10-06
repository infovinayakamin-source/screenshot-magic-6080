import type { Product, StockStatus } from "@/lib/products";

export type CatalogRow = {
  id: string;
  name: string;
  name_hi: string | null;
  slug: string;
  sku: string;
  stones: string | null;
  short_description: string | null;
  description: string | null;
  product_info: string | null;
  original_price: number | null;
  price: number;
  stock: number;
  low_stock_threshold: number;
  featured: boolean;
  apply_branding: boolean;
  created_at: string;
  zodiac_signs: { name_en: string; name_hi: string; symbol: string; slug: string } | null;
  product_images: { original_image_url: string; branded_image_url: string | null; is_primary: boolean; sort_order: number }[];
};

export function stockStatus(stock: number, threshold: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock <= threshold) return "low";
  return "in";
}

/** Which image the shop shows: branded copy only when branding is on everywhere and it exists. */
export function displayImage(
  img: { original_image_url: string; branded_image_url: string | null },
  brandingOn: boolean,
  applyBranding: boolean,
) {
  return brandingOn && applyBranding && img.branded_image_url ? img.branded_image_url : img.original_image_url;
}

export function toProduct(r: CatalogRow, brandingOn: boolean): Product {
  const imgs = [...r.product_images].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order,
  );
  const status = stockStatus(r.stock, r.low_stock_threshold);
  return {
    id: r.id,
    name: r.name,
    nameHi: r.name_hi ?? "",
    slug: r.slug,
    description: r.description ?? "",
    shortDescription: r.short_description ?? "",
    productInfo: r.product_info ?? "",
    price: r.price,
    compareAtPrice: r.original_price && r.original_price > r.price ? r.original_price : undefined,
    images: imgs.map((i) => displayImage(i, brandingOn, r.apply_branding)),
    category: "Bracelets",
    collection: ["zodiac-crystal-collection"],
    stoneType: r.stones ?? "Natural stone",
    stones: r.stones ?? "",
    color: "",
    size: "8 mm beads, elastic stretch",
    weight: "",
    rating: 0,
    reviewCount: 0,
    // Customers only need to know if they can buy; cap the visible number.
    inventory: Math.min(r.stock, 20),
    stockStatus: status,
    featured: r.featured,
    bestseller: false,
    sign: r.zodiac_signs?.name_en ?? "",
    signHi: r.zodiac_signs?.name_hi ?? "",
    symbol: r.zodiac_signs?.symbol ?? "",
    signSlug: r.zodiac_signs?.slug ?? "",
    createdAt: r.created_at,
  };
}
