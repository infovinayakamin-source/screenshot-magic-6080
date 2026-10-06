import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { toProduct, type CatalogRow } from "@/lib/catalog-shape";

/** Public, live catalogue: only Active products, safe columns only. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const db = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const [prod, settings] = await Promise.all([
    db
      .from("products")
      .select(
        "id, name, name_hi, slug, sku, stones, short_description, description, product_info, original_price, price, stock, low_stock_threshold, featured, apply_branding, created_at, zodiac_signs(name_en, name_hi, symbol, slug), product_images(original_image_url, branded_image_url, is_primary, sort_order)",
      )
      .eq("status", "active")
      .order("zodiac_sign_id"),
    db.from("product_branding_settings").select("enabled").eq("id", 1).maybeSingle(),
  ]);
  if (prod.error) {
    console.error(prod.error);
    return { products: [] };
  }
  const brandingOn = settings.data?.enabled ?? true;
  return { products: (prod.data as unknown as CatalogRow[]).map((r) => toProduct(r, brandingOn)) };
});
