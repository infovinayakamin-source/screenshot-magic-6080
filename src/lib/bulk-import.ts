import { ZODIAC_SIGNS } from "@/lib/zodiac";

export type ParsedRow =
  | { ok: true; line: number; name: string; zodiac_sign_id: number; signLabel: string; price: number; stock: number }
  | { ok: false; line: number; raw: string; error: string };

/** Accepts "Name | sign (Hindi or English) | price | stock", one per line. */
export function parseBulk(text: string): ParsedRow[] {
  return text
    .split(/\r?\n/)
    .map((raw, i) => ({ raw: raw.trim(), line: i + 1 }))
    .filter((r) => r.raw.length > 0)
    .map(({ raw, line }): ParsedRow => {
      const parts = raw.split("|").map((p) => p.trim());
      if (parts.length !== 4) return { ok: false, line, raw, error: "Needs 4 parts: name | sign | price | stock" };
      const [name, signText, priceText, stockText] = parts as [string, string, string, string];
      if (name.length < 2) return { ok: false, line, raw, error: "Name is missing" };
      const idx = ZODIAC_SIGNS.findIndex(
        (s) => s.hi === signText || s.en.toLowerCase() === signText.toLowerCase(),
      );
      if (idx < 0) return { ok: false, line, raw, error: `Unknown zodiac sign "${signText}"` };
      if (!/^\d+$/.test(priceText)) return { ok: false, line, raw, error: "Price must be a whole number" };
      if (!/^\d+$/.test(stockText)) return { ok: false, line, raw, error: "Stock must be a whole number" };
      const sign = ZODIAC_SIGNS[idx]!;
      return { ok: true, line, name, zodiac_sign_id: idx + 1, signLabel: `${sign.en} · ${sign.hi}`, price: Number(priceText), stock: Number(stockText) };
    });
}
