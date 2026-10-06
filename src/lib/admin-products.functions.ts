import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { adminClient } from "./admin.server";

export const PRODUCT_STATUSES = ["draft", "active", "inactive", "archived"] as const;

export type AdminImage = {
  id: string;
  original_image_url: string;
  branded_image_url: string | null;
  branding_error: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  name_hi: string | null;
  zodiac_sign_id: number;
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
  status: string;
  featured: boolean;
  apply_branding: boolean;
  created_at: string;
  updated_at: string;
  product_images: AdminImage[];
};

export type BrandingSettings = {
  enabled: boolean;
  logo_url: string | null;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size: "small" | "medium";
  opacity: number;
  padding: number;
};

const SELECT =
  "id, name, name_hi, zodiac_sign_id, slug, sku, stones, short_description, description, product_info, original_price, price, stock, low_stock_threshold, status, featured, apply_branding, created_at, updated_at, product_images(id, original_image_url, branded_image_url, branding_error, is_primary, sort_order)";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "bracelet";

async function uniqueSlug(db: Awaited<ReturnType<typeof adminClient>>, base: string, exceptId?: string) {
  let slug = slugify(base);
  for (let i = 2; i < 50; i++) {
    const { data } = await db.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data || data.id === exceptId) return slug;
    slug = `${slugify(base)}-${i}`;
  }
  return `${slugify(base)}-${Date.now()}`;
}

function fail(error: unknown, msg: string): never {
  console.error(error);
  const m = (error as { message?: string })?.message ?? "";
  if (m.includes("products_sku_key")) throw new Error("This SKU is already used by another bracelet");
  throw new Error(msg);
}

export const listAdminProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await adminClient(context.userId);
    const { data, error } = await db.from("products").select(SELECT).order("updated_at", { ascending: false });
    if (error) fail(error, "Could not load bracelets");
    return { products: (data ?? []) as unknown as AdminProduct[] };
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  name_hi: z.string().trim().max(120).nullable(),
  zodiac_sign_id: z.number().int().min(1).max(12),
  sku: z.string().trim().min(2).max(40),
  stones: z.string().trim().max(300).nullable(),
  short_description: z.string().trim().max(400).nullable(),
  description: z.string().trim().max(5000).nullable(),
  product_info: z.string().trim().max(5000).nullable(),
  original_price: z.number().int().min(0).max(1_000_000).nullable(),
  price: z.number().int().min(0).max(1_000_000),
  stock: z.number().int().min(0).max(100_000),
  low_stock_threshold: z.number().int().min(0).max(1000),
  status: z.enum(PRODUCT_STATUSES),
  featured: z.boolean(),
  apply_branding: z.boolean(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productInput.parse(d))
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const { id, ...fields } = data;
    if (id) {
      const { data: before } = await db.from("products").select("stock").eq("id", id).single();
      const { error } = await db.from("products").update(fields).eq("id", id);
      if (error) fail(error, "Could not save bracelet");
      if (before && before.stock !== fields.stock) {
        await db.from("inventory_history").insert({
          product_id: id,
          change: fields.stock - before.stock,
          stock_after: fields.stock,
          reason: "Admin edit",
          actor: context.userId,
        });
      }
      return { id };
    }
    const slug = await uniqueSlug(db, fields.name);
    const { data: row, error } = await db.from("products").insert({ ...fields, slug }).select("id").single();
    if (error) fail(error, "Could not create bracelet");
    if (fields.stock > 0) {
      await db.from("inventory_history").insert({
        product_id: row.id,
        change: fields.stock,
        stock_after: fields.stock,
        reason: "Initial stock",
        actor: context.userId,
      });
    }
    return { id: row.id };
  });

export const setProductStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(PRODUCT_STATUSES).optional(), featured: z.boolean().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const patch: { status?: string; featured?: boolean } = {};
    if (data.status) patch.status = data.status;
    if (data.featured !== undefined) patch.featured = data.featured;
    const { error } = await db.from("products").update(patch).eq("id", data.id);
    if (error) fail(error, "Could not update bracelet");
    return { ok: true };
  });

export const adjustStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), stock: z.number().int().min(0).max(100_000), reason: z.string().trim().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const { data: before, error: e1 } = await db.from("products").select("stock").eq("id", data.id).single();
    if (e1) fail(e1, "Bracelet not found");
    const { error } = await db.from("products").update({ stock: data.stock }).eq("id", data.id);
    if (error) fail(error, "Could not update stock");
    await db.from("inventory_history").insert({
      product_id: data.id,
      change: data.stock - before.stock,
      stock_after: data.stock,
      reason: data.reason,
      actor: context.userId,
    });
    return { ok: true };
  });

export const getStockHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const { data: rows, error } = await db
      .from("inventory_history")
      .select("id, change, stock_after, reason, created_at")
      .eq("product_id", data.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) fail(error, "Could not load history");
    return { history: rows ?? [] };
  });

export const duplicateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const { data: src, error } = await db.from("products").select(SELECT).eq("id", data.id).single();
    if (error) fail(error, "Bracelet not found");
    const p = src as unknown as AdminProduct;
    const slug = await uniqueSlug(db, `${p.name} copy`);
    const { data: row, error: e2 } = await db
      .from("products")
      .insert({
        name: `${p.name} (copy)`,
        name_hi: p.name_hi,
        zodiac_sign_id: p.zodiac_sign_id,
        slug,
        sku: `${p.sku}-COPY-${Date.now().toString(36).slice(-4).toUpperCase()}`,
        stones: p.stones,
        short_description: p.short_description,
        description: p.description,
        product_info: p.product_info,
        original_price: p.original_price,
        price: p.price,
        stock: 0,
        low_stock_threshold: p.low_stock_threshold,
        status: "draft",
        featured: false,
        apply_branding: p.apply_branding,
      })
      .select("id")
      .single();
    if (e2) fail(e2, "Could not duplicate");
    if (p.product_images.length) {
      await db.from("product_images").insert(
        p.product_images.map((i) => ({
          product_id: row.id,
          original_image_url: i.original_image_url,
          branded_image_url: i.branded_image_url,
          is_primary: i.is_primary,
          sort_order: i.sort_order,
        })),
      );
    }
    return { id: row.id };
  });

const imageUrl = z.string().min(1).max(500).regex(/^\/(api\/public\/img|__l5e)\//);

export const addProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        product_id: z.string().uuid(),
        original_image_url: imageUrl,
        branded_image_url: imageUrl.nullable(),
        branding_error: z.string().max(300).nullable(),
        is_primary: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    if (data.is_primary) await db.from("product_images").update({ is_primary: false }).eq("product_id", data.product_id);
    const { count } = await db.from("product_images").select("id", { count: "exact", head: true }).eq("product_id", data.product_id);
    const { data: row, error } = await db
      .from("product_images")
      .insert({ ...data, sort_order: count ?? 0 })
      .select("id")
      .single();
    if (error) fail(error, "Could not save image");
    return { id: row.id };
  });

export const updateProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        branded_image_url: imageUrl.nullable().optional(),
        branding_error: z.string().max(300).nullable().optional(),
        make_primary: z.boolean().optional(),
        remove: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    if (data.remove) {
      const { error } = await db.from("product_images").delete().eq("id", data.id);
      if (error) fail(error, "Could not remove image");
      return { ok: true };
    }
    if (data.make_primary) {
      const { data: img } = await db.from("product_images").select("product_id").eq("id", data.id).single();
      if (img) await db.from("product_images").update({ is_primary: false }).eq("product_id", img.product_id);
    }
    const patch: { branded_image_url?: string | null; branding_error?: string | null; is_primary?: boolean } = {};
    if (data.branded_image_url !== undefined) patch.branded_image_url = data.branded_image_url;
    if (data.branding_error !== undefined) patch.branding_error = data.branding_error;
    if (data.make_primary) patch.is_primary = true;
    const { error } = await db.from("product_images").update(patch).eq("id", data.id);
    if (error) fail(error, "Could not update image");
    return { ok: true };
  });

export const getBrandingSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await adminClient(context.userId);
    const { data, error } = await db
      .from("product_branding_settings")
      .select("enabled, logo_url, position, size, opacity, padding")
      .eq("id", 1)
      .single();
    if (error) fail(error, "Could not load settings");
    return { ...data, opacity: Number(data.opacity) } as BrandingSettings;
  });

export const saveBrandingSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        enabled: z.boolean(),
        logo_url: imageUrl.nullable(),
        position: z.enum(["top-left", "top-right", "bottom-left", "bottom-right"]),
        size: z.enum(["small", "medium"]),
        opacity: z.number().min(0.1).max(1),
        padding: z.number().int().min(0).max(20),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    const { error } = await db
      .from("product_branding_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) fail(error, "Could not save settings");
    return { ok: true };
  });

export const bulkImportProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        rows: z
          .array(
            z.object({
              name: z.string().trim().min(2).max(120),
              zodiac_sign_id: z.number().int().min(1).max(12),
              price: z.number().int().min(0).max(1_000_000),
              stock: z.number().int().min(0).max(100_000),
            }),
          )
          .min(1)
          .max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const db = await adminClient(context.userId);
    let created = 0;
    for (const r of data.rows) {
      const slug = await uniqueSlug(db, r.name);
      const sku = `SH-${slug.slice(0, 10).toUpperCase()}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
      const { data: row, error } = await db
        .from("products")
        .insert({ ...r, slug, sku, status: "draft" })
        .select("id")
        .single();
      if (error) {
        console.error(error);
        continue;
      }
      created++;
      if (r.stock > 0)
        await db.from("inventory_history").insert({ product_id: row.id, change: r.stock, stock_after: r.stock, reason: "Bulk import", actor: context.userId });
    }
    return { created };
  });
