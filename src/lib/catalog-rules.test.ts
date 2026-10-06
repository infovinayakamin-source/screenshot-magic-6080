import { describe, expect, it } from "vitest";
import { parseBulk } from "./bulk-import";
import { displayImage, stockStatus } from "./catalog-shape";
import { logoRect } from "./branding";

describe("stock status", () => {
  it("is out of stock at 0", () => expect(stockStatus(0, 3)).toBe("out"));
  it("is low at or below the threshold", () => expect(stockStatus(3, 3)).toBe("low"));
  it("is in stock above the threshold", () => expect(stockStatus(4, 3)).toBe("in"));
});

describe("which image the shop shows", () => {
  const img = { original_image_url: "/o.jpg", branded_image_url: "/b.jpg" };
  it("shows branded when branding is on", () => expect(displayImage(img, true, true)).toBe("/b.jpg"));
  it("shows original when branding is off globally", () => expect(displayImage(img, false, true)).toBe("/o.jpg"));
  it("shows original when the product opts out", () => expect(displayImage(img, true, false)).toBe("/o.jpg"));
  it("falls back to original if no branded copy exists", () =>
    expect(displayImage({ original_image_url: "/o.jpg", branded_image_url: null }, true, true)).toBe("/o.jpg"));
});

describe("logo placement", () => {
  it("bottom-right keeps margin and aspect ratio", () => {
    const r = logoRect(1000, 1000, 200, 100, { position: "bottom-right", size: "small", padding: 4 });
    expect(r).toEqual({ x: 1000 - 140 - 40, y: 1000 - 70 - 40, width: 140, height: 70 });
  });
});

describe("bulk import", () => {
  it("parses Hindi sign rows", () => {
    const [row] = parseBulk("Scorpio Bracelet | वृश्चिक | 1499 | 10");
    expect(row).toMatchObject({ ok: true, zodiac_sign_id: 8, price: 1499, stock: 10 });
  });
  it("flags malformed rows instead of importing them", () => {
    const rows = parseBulk("Bad row | मेष | abc | 5\nNo sign | xyz | 100 | 1");
    expect(rows.every((r) => !r.ok)).toBe(true);
  });
});
