import { supabase } from "@/integrations/supabase/client";
import defaultLogo from "@/assets/logo.png";
import type { BrandingSettings } from "@/lib/admin-products.functions";

/** Logo width as a share of the photo's shorter side. */
export const LOGO_SCALE = { small: 0.14, medium: 0.2 } as const;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image could not be loaded"));
    img.src = src;
  });
}

/** Computes where the logo goes; exported so the placement rule can be tested. */
export function logoRect(
  w: number,
  h: number,
  logoW: number,
  logoH: number,
  s: Pick<BrandingSettings, "position" | "size" | "padding">,
) {
  const width = Math.round(Math.min(w, h) * LOGO_SCALE[s.size]);
  const height = Math.round(width * (logoH / logoW)); // keep the logo's own proportions
  const margin = Math.round(Math.min(w, h) * (s.padding / 100));
  const x = s.position.endsWith("left") ? margin : w - width - margin;
  const y = s.position.startsWith("top") ? margin : h - height - margin;
  return { x, y, width, height };
}

/**
 * Draws the official logo once onto a copy of the photo. The original file is
 * never changed; the result is a new image at full resolution.
 */
export async function brandImage(source: string | Blob, s: BrandingSettings): Promise<Blob> {
  const srcUrl = typeof source === "string" ? source : URL.createObjectURL(source);
  try {
    const [photo, logo] = await Promise.all([loadImage(srcUrl), loadImage(s.logo_url || defaultLogo)]);
    const w = photo.naturalWidth;
    const h = photo.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(photo, 0, 0, w, h);
    const r = logoRect(w, h, logo.naturalWidth, logo.naturalHeight, s);
    ctx.globalAlpha = s.opacity;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(logo, r.x, r.y, r.width, r.height);
    ctx.globalAlpha = 1;
    const isPng = typeof source !== "string" ? source.type === "image/png" : srcUrl.toLowerCase().endsWith(".png");
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), isPng ? "image/png" : "image/jpeg", 0.95),
    );
  } finally {
    if (typeof source !== "string") URL.revokeObjectURL(srcUrl);
  }
}

/** Uploads to the private product bucket; returns the site URL that serves it. */
export async function uploadProductFile(file: Blob, folder: "originals" | "branded" | "logo") {
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  return `/api/public/img/${path}`;
}
