import { createFileRoute } from "@tanstack/react-router";

// Serves product photos from the private storage bucket. Read-only, only
// files under the product folders, never listings.
export const Route = createFileRoute("/api/public/img/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!/^(originals|branded|logo)\/[A-Za-z0-9._\-/]+$/.test(path) || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("product-images").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "content-type": data.type || "image/jpeg",
            // Paths are unique per upload, so they can be cached for a long time.
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
