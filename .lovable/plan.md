# Zodiac Bracelet Admin + Automatic Logo Branding

Turn the fixed bracelet list into a live, admin-managed catalogue. Existing look stays the same; only data source changes and admin gets new screens.

## What the owner gets

**Admin → Zodiac Bracelets**
- Table: image, product, sign, SKU, price, stock, stock status, product status, featured, last updated
- Actions: Edit, Preview, Duplicate, Archive; filters for search, sign, stock, status, featured
- Add/Edit form: name, Hindi name, sign (12 fixed signs with Hindi + symbol), SKU, stones, short/full description, product info, original + selling price, stock, main + extra images, featured, status (Draft / Active / Inactive / Archived), "Apply ShivAmrit branding" checkbox
- Stock adjust with reason; history of every change (admin edits and sales)
- Bulk import: paste `Name | हिन्दी sign | price | stock` lines → preview with row errors highlighted → import only valid rows as Draft

**Admin → Settings → Product Image Branding**
- On/off, replace logo, position (4 corners), size (small/medium), opacity, padding, live preview on a sample photo

**Branding behaviour**
- Original photo always stored untouched; a separate branded copy is made with the official logo once, small, in the chosen corner
- If branding fails, product still saves with message "Product saved. Branded image could not be generated." and a Retry Branding button
- Branding off (globally or per product) → shop shows original photo

**Customer side**
- Shop / collection: "Zodiac Crystal Collection" with sign chips (All + 12, scrollable on mobile), search, In stock only, sort (Featured, Newest, Price low/high), 2-column mobile grid
- Cards: image, sign + Hindi name, name, stones, price (+ crossed original), stock label ("Only a few left" / "Out of stock")
- Product page: gallery, names, symbol, stones, price, availability, description, info, quantity, Add to Cart / Buy Now (disabled at 0 stock), "You may also like"
- Only Active products appear; price/stock/image changes show immediately
- Paid/COD orders reduce stock automatically; checkout refuses quantities beyond stock

**Starting data**
- The current 11 bracelets (with their real photos, ₹999, stock 30) are copied into the database as Active so the shop looks the same on day one. Aquarius has no photo yet, so no product is created for it.

## Final checks
Add Aries test bracelet with image → logo applied, original kept → shows under Aries with Hindi + ♈ → change price/stock → site updates → stock 0 disables buttons → Inactive hides it → reactivate → branding off/on swaps image → mobile filters, search, admin filters. Test product deleted afterwards.

## Technical details
- Tables: `zodiac_signs` (seeded 12), `products` (zodiac_sign_id, slug, sku unique, prices, stock, low_stock_threshold, status, featured, apply_branding), `product_images` (original_image_url, branded_image_url, is_primary, sort, branding_error), `inventory_history`, `product_branding_settings` (single row). Stock lives on `products` (no separate inventory table — one source of truth).
- RLS: public can read Active products, their images and signs only; all writes via admin-checked server functions (`has_role`).
- Storage: public bucket `product-images` (originals/ and branded/ folders), admin-only writes; logo stored there too.
- Branding runs in the browser on a canvas at admin upload time (full resolution, PNG/high-quality JPEG, logo aspect ratio preserved), then uploaded; server workers can't run image libraries reliably. Settings changes offer "Re-brand all".
- Optimised sizes via storage image transform URLs (thumb/card/detail) with lazy loading, fixed square aspect.
- Stock decrement + history in a security-definer SQL function called when an order becomes paid/COD; `payments.functions.ts` prices from DB instead of `zodiac.ts`.
- `products.ts` / `zodiac.ts` static catalogue replaced by a public server function + React Query; cart stores product ids resolved from live data.
- Admin routes under `_authenticated/admin.*`, same access check as orders.
