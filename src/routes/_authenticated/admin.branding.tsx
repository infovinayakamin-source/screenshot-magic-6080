import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getBrandingSettings,
  listAdminProducts,
  saveBrandingSettings,
  updateProductImage,
  type BrandingSettings,
} from "@/lib/admin-products.functions";
import { brandImage, uploadProductFile } from "@/lib/branding";
import { BRAND } from "@/lib/products";
import defaultLogo from "@/assets/logo.jpg";

export const Route = createFileRoute("/_authenticated/admin/branding")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Product Image Branding — ShivAmrit Healers Admin" },
      { property: "og:description", content: "Logo placement settings for product photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: `Product Image Branding — ${BRAND} admin` },
      { name: "description", content: "Logo placement settings for product photos." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell>
      <BrandingPage />
    </AdminShell>
  ),
});

function BrandingPage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getBrandingSettings);
  const saveFn = useServerFn(saveBrandingSettings);
  const listFn = useServerFn(listAdminProducts);
  const updImg = useServerFn(updateProductImage);
  const settings = useQuery({ queryKey: ["branding-settings"], queryFn: () => getFn() });
  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => listFn() });
  const [s, setS] = useState<BrandingSettings | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [busy, setBusy] = useState("");

  useEffect(() => { if (settings.data && !s) setS(settings.data); }, [settings.data, s]);

  const samples = (products.data?.products ?? []).flatMap((p) => p.product_images.map((i) => ({ name: p.name, img: i })));
  const sample = samples[sampleIdx];

  useEffect(() => {
    if (!s || !sample) return;
    let url: string | null = null;
    let cancelled = false;
    brandImage(sample.img.original_image_url, s)
      .then((b) => { if (cancelled) return; url = URL.createObjectURL(b); setPreview(url); })
      .catch(() => setPreview(null));
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [s, sample]);

  if (!s) return <div className="h-40 animate-pulse rounded-lg bg-sand/60" />;

  async function save() {
    setBusy("save");
    try {
      await saveFn({ data: s! });
      toast.success("Branding settings saved");
      void qc.invalidateQueries({ queryKey: ["branding-settings"] });
      void qc.invalidateQueries({ queryKey: ["catalog"] });
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(""); }
  }

  async function uploadLogo(file: File) {
    setBusy("logo");
    try {
      const url = await uploadProductFile(file, "logo");
      setS({ ...s!, logo_url: url });
      toast.success("Logo uploaded — save to apply");
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(""); }
  }

  async function rebrandAll() {
    setBusy("all");
    let ok = 0, failed = 0;
    for (const { img } of samples) {
      try {
        const blob = await brandImage(img.original_image_url, s!);
        const url = await uploadProductFile(blob, "branded");
        await updImg({ data: { id: img.id, branded_image_url: url, branding_error: null } });
        ok++;
      } catch (e) {
        failed++;
        await updImg({ data: { id: img.id, branding_error: (e as Error).message.slice(0, 280) } }).catch(() => {});
      }
    }
    setBusy("");
    void qc.invalidateQueries({ queryKey: ["admin-products"] });
    void qc.invalidateQueries({ queryKey: ["catalog"] });
    toast[failed ? "warning" : "success"](`${ok} photo(s) re-branded${failed ? `, ${failed} failed` : ""}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <p className="eyebrow text-gold">Settings</p>
        <h1 className="font-display text-3xl text-ink">Product Image Branding</h1>
        <p className="mt-2 text-sm text-muted-foreground">Original photos are never changed. The logo is added to a separate copy shown on the store.</p>

        <div className="mt-6 grid gap-5">
          <label className="flex items-center gap-3 text-sm"><Switch checked={s.enabled} onCheckedChange={(v) => setS({ ...s, enabled: v })} /> Branding enabled on the store</label>
          <div className="grid gap-2">
            <Label className="text-xs">Logo (used exactly as uploaded)</Label>
            <div className="flex items-center gap-3">
              <img src={s.logo_url || defaultLogo} alt="Current logo" className="size-16 rounded border border-border object-contain" />
              <Input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy === "logo"} onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} aria-label="Replace logo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Logo position</Label>
              <Select value={s.position} onValueChange={(v) => setS({ ...s, position: v as BrandingSettings["position"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top left</SelectItem>
                  <SelectItem value="top-right">Top right</SelectItem>
                  <SelectItem value="bottom-left">Bottom left</SelectItem>
                  <SelectItem value="bottom-right">Bottom right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Logo size</Label>
              <Select value={s.size} onValueChange={(v) => setS({ ...s, size: v as BrandingSettings["size"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2"><Label className="text-xs">Opacity — {Math.round(s.opacity * 100)}%</Label><Slider min={10} max={100} step={5} value={[Math.round(s.opacity * 100)]} onValueChange={([v]) => setS({ ...s, opacity: (v ?? 95) / 100 })} /></div>
          <div className="grid gap-2"><Label className="text-xs">Edge spacing — {s.padding}%</Label><Slider min={0} max={20} step={1} value={[s.padding]} onValueChange={([v]) => setS({ ...s, padding: v ?? 4 })} /></div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ink" disabled={!!busy} onClick={save}>{busy === "save" ? "Saving…" : "Save settings"}</Button>
            <Button variant="outline" disabled={!!busy || samples.length === 0} onClick={rebrandAll}>{busy === "all" ? "Re-branding…" : `Re-brand all ${samples.length} photos`}</Button>
          </div>
          <p className="text-xs text-muted-foreground">After changing position, size or logo, use “Re-brand all” so existing photos use the new look.</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Preview</p>
        {sample ? (
          <>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <figure><img src={sample.img.original_image_url} alt="Original" className="aspect-square w-full rounded border border-border object-cover" /><figcaption className="mt-1 text-xs text-muted-foreground">Original</figcaption></figure>
              <figure>{preview ? <img src={preview} alt="Branded preview" className="aspect-square w-full rounded border border-gold object-cover" /> : <div className="aspect-square animate-pulse rounded bg-sand" />}<figcaption className="mt-1 text-xs text-muted-foreground">With logo</figcaption></figure>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <Button size="sm" variant="outline" onClick={() => setSampleIdx((i) => (i - 1 + samples.length) % samples.length)}>Previous</Button>
              <span className="text-muted-foreground">{sample.name}</span>
              <Button size="sm" variant="outline" onClick={() => setSampleIdx((i) => (i + 1) % samples.length)}>Next</Button>
            </div>
          </>
        ) : <p className="mt-2 text-sm text-muted-foreground">Add a bracelet photo to see a preview.</p>}
      </div>
    </div>
  );
}
