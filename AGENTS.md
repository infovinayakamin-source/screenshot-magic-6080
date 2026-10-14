<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep product image navigation and touch/desktop zoom in the shared `ProductGallery` component; one gallery serves bracelet and pendant detail pages consistently.
- Payments: Razorpay orders are created and signature-verified only in server functions (src/lib/payments.functions.ts), priced from the server catalog; orders table is server-only (no RLS policies) because shoppers check out without accounts.
- Homepage promotional posters live in a dedicated carousel component and use the real zodiac catalog imagery, so promotions never imply unavailable products.

- Homepage merchandising uses a live-catalog full-width StorefrontHero, scrollable zodiac/gift rails and shared ProductCard/QuickView; this keeps navigation, prices and availability aligned with admin updates.
