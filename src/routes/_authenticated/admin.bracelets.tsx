import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Eye, Pencil, Archive, Plus, Upload, RefreshCw, Star, History, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  addProductImage,
  adjustStock,
  bulkImportProducts,
  duplicateProduct,
  getBrandingSettings,
  getStockHistory,
  listAdminProducts,
  saveProduct,
  setProductStatus,
  updateProductImage,
  type AdminImage,
  type AdminProduct,
  type BrandingSettings,
} from "@/lib/admin-products.functions";
import { ZODIAC_SIGNS } from "@/lib/zodiac";
import { BRAND, formatINR } from "@/lib/products";
import { stockStatus } from "@/lib/catalog-shape";
import { brandImage, uploadProductFile } from "@/lib/branding";
import { parseBulk } from "@/lib/bulk-import";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/bracelets")({
  head: () => ({
    meta: [
      { title: `Zodiac Bracelets — ${BRAND} admin` },
      { name: "description", content: "Manage zodiac bracelets, photos, prices and stock." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell>
      <BraceletsAdmin />
    </AdminShell>
  ),
});

const SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const signLabel = (id: number) => {
  const s = ZODIAC_SIGNS[id - 1];
  return s ? `${SYMBOLS[id - 1]} ${s.en} · ${s.hi}` : "";
};
const STATUS_LABEL: Record<string, string> = { draft: "Draft", active: "Active", inactive: "Inactive", archived: "Archived" };
const STOCK_LABEL = { in: "In stock", low: "LOW STOCK", out: "Out of stock" } as const;

export function shownImage(p: AdminProduct, s: BrandingSettings | undefined) {
  const img = [...p.product_images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)[0];
  if (!img) return null;
  return s?.enabled && p.apply_branding && img.branded_image_url ? img.branded_image_url : img.original_image_url;
}

function BraceletsAdmin() {
  const qc = useQueryClient();
  const list = useServerFn(listAdminProducts);
  const settingsFn = useServerFn(getBrandingSettings);
  const statusFn = useServerFn(setProductStatus);
  const dupFn = useServerFn(duplicateProduct);
  const products = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });
  const settings = useQuery({ queryKey: ["branding-settings"], queryFn: () => settingsFn() });

  const [q, setQ] = useState("");
  const [sign, setSign] = useState("all");
  const [stock, setStock] = useState("all");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<AdminProduct | null>(null);

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-products"] });
    void qc.invalidateQueries({ queryKey: ["catalog"] });
  };

  const quick = useMutation({
    mutationFn: (d: { id: string; status?: "draft" | "active" | "inactive" | "archived"; featured?: boolean }) => statusFn({ data: d }),
    onSuccess: () => { toast.success("Updated"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const dup = useMutation({
    mutationFn: (id: string) => dupFn({ data: { id } }),
    onSuccess: () => { toast.success("Duplicated as Draft"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (products.data?.products ?? []).filter((p) => {
      const st = stockStatus(p.stock, p.low_stock_threshold);
      return (
        (!term || `${p.name} ${p.name_hi ?? ""} ${p.sku} ${p.stones ?? ""}`.toLowerCase().includes(term)) &&
        (sign === "all" || String(p.zodiac_sign_id) === sign) &&
        (stock === "all" || st === stock) &&
        (status === "all" || p.status === status) &&
        (featured === "all" || String(p.featured) === featured)
      );
    });
  }, [products.data, q, sign, stock, status, featured]);

  const lowCount = (products.data?.products ?? []).filter((p) => p.status === "active" && stockStatus(p.stock, p.low_stock_threshold) !== "in").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-gold">Catalogue</p>
          <h1 className="font-display text-3xl text-ink">Zodiac Bracelets</h1>
          {lowCount > 0 && <p className="mt-1 text-sm font-medium text-destructive">{lowCount} active bracelet(s) low or out of stock</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}><Upload className="size-4" /> Bulk import</Button>
          <Button variant="ink" onClick={() => setEditing("new")}><Plus className="size-4" /> Add bracelet</Button>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Input placeholder="Search name, SKU, stone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search bracelets" />
        <Filter value={sign} onChange={setSign} label="Zodiac" options={[["all", "All signs"], ...ZODIAC_SIGNS.map((s, i) => [String(i + 1), `${s.en} · ${s.hi}`] as [string, string])]} />
        <Filter value={stock} onChange={setStock} label="Stock" options={[["all", "All stock"], ["in", "In stock"], ["low", "Low stock"], ["out", "Out of stock"]]} />
        <Filter value={status} onChange={setStatus} label="Status" options={[["all", "All statuses"], ["draft", "Draft"], ["active", "Active"], ["inactive", "Inactive"], ["archived", "Archived"]]} />
        <Filter value={featured} onChange={setFeatured} label="Featured" options={[["all", "Featured: any"], ["true", "Featured"], ["false", "Not featured"]]} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-sand/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>{["Image", "Product", "Zodiac", "SKU", "Price", "Stock", "Stock status", "Status", "Featured", "Updated", "Actions"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.isPending && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!products.isPending && rows.length === 0 && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">No bracelets match.</td></tr>}
            {rows.map((p) => {
              const st = stockStatus(p.stock, p.low_stock_threshold);
              const img = shownImage(p, settings.data);
              const failed = p.product_images.some((i) => i.branding_error);
              return (
                <tr key={p.id} className="border-t border-border align-middle">
                  <td className="px-3 py-2">{img ? <img src={img} alt="" loading="lazy" className="size-12 rounded border border-border object-cover" /> : <div className="size-12 rounded border border-dashed border-border" />}</td>
                  <td className="px-3 py-2"><p className="font-medium text-ink">{p.name}</p>{p.name_hi && <p className="text-xs text-muted-foreground">{p.name_hi}</p>}{failed && <p className="text-[11px] text-destructive">Branding failed — open to retry</p>}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{signLabel(p.zodiac_sign_id)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatINR(p.price)}{p.original_price && p.original_price > p.price ? <span className="ml-1 text-xs text-muted-foreground line-through">{formatINR(p.original_price)}</span> : null}</td>
                  <td className="px-3 py-2"><button type="button" className="underline underline-offset-4" onClick={() => setHistoryFor(p)}>{p.stock}</button></td>
                  <td className="px-3 py-2"><span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", st === "in" ? "bg-sand text-ink" : "bg-destructive/10 text-destructive")}>{STOCK_LABEL[st]}</span></td>
                  <td className="px-3 py-2">
                    <Select value={p.status} onValueChange={(v) => quick.mutate({ id: p.id, status: v as "draft" })}>
                      <SelectTrigger className="h-8 w-[110px] text-xs" aria-label="Product status"><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2"><button type="button" aria-label="Toggle featured" onClick={() => quick.mutate({ id: p.id, featured: !p.featured })}><Star className={cn("size-4", p.featured ? "fill-gold text-gold" : "text-muted-foreground")} /></button></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{new Date(p.updated_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <IconBtn label="Edit" onClick={() => setEditing(p)}><Pencil /></IconBtn>
                      <IconBtn label="Preview" asLink={p.status === "active" ? p.slug : undefined} onClick={() => toast("Only Active bracelets are visible on the store. Set status to Active to preview.")}><Eye /></IconBtn>
                      <IconBtn label="Duplicate" onClick={() => dup.mutate(p.id)}><Copy /></IconBtn>
                      <IconBtn label="Archive" onClick={() => quick.mutate({ id: p.id, status: "archived" })}><Archive /></IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          product={editing === "new" ? null : (products.data?.products.find((p) => p.id === editing.id) ?? editing)}
          settings={settings.data}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
      {bulkOpen && <BulkImport onClose={() => setBulkOpen(false)} onDone={refresh} />}
      {historyFor && <StockDialog product={historyFor} onClose={() => setHistoryFor(null)} onDone={refresh} />}
    </div>
  );
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: [string, string][] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function IconBtn({ label, onClick, children, asLink }: { label: string; onClick: () => void; children: React.ReactNode; asLink?: string | undefined }) {
  const cls = "grid size-8 place-items-center rounded border border-border text-ink hover:bg-sand [&_svg]:size-3.5";
  if (asLink) return <Link to="/product/$slug" params={{ slug: asLink }} target="_blank" aria-label={label} title={label} className={cls}>{children}</Link>;
  return <button type="button" aria-label={label} title={label} className={cls} onClick={onClick}>{children}</button>;
}

/* ------------------------------------------------------------ form ------- */

type FormState = {
  name: string; name_hi: string; zodiac_sign_id: number; sku: string; stones: string;
  short_description: string; description: string; product_info: string;
  original_price: string; price: string; stock: string; low_stock_threshold: string;
  status: "draft" | "active" | "inactive" | "archived"; featured: boolean; apply_branding: boolean;
};

function toForm(p: AdminProduct | null): FormState {
  return {
    name: p?.name ?? "", name_hi: p?.name_hi ?? "", zodiac_sign_id: p?.zodiac_sign_id ?? 1, sku: p?.sku ?? "",
    stones: p?.stones ?? "", short_description: p?.short_description ?? "", description: p?.description ?? "",
    product_info: p?.product_info ?? "", original_price: p?.original_price != null ? String(p.original_price) : "",
    price: p ? String(p.price) : "", stock: p ? String(p.stock) : "0", low_stock_threshold: p ? String(p.low_stock_threshold) : "3",
    status: (p?.status as FormState["status"]) ?? "draft", featured: p?.featured ?? false, apply_branding: p?.apply_branding ?? true,
  };
}

function ProductForm({ product, settings, onClose, onSaved }: { product: AdminProduct | null; settings: BrandingSettings | undefined; onClose: () => void; onSaved: () => void }) {
  const save = useServerFn(saveProduct);
  const addImg = useServerFn(addProductImage);
  const updImg = useServerFn(updateProductImage);
  const [f, setF] = useState<FormState>(() => toForm(product));
  const [id, setId] = useState<string | null>(product?.id ?? null);
  const [pending, setPending] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const images = product?.product_images ?? [];
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  async function brandAndUpload(source: string | Blob): Promise<{ url: string | null; error: string | null }> {
    if (!settings) return { url: null, error: "Branding settings not loaded" };
    try {
      const blob = await brandImage(source, settings);
      return { url: await uploadProductFile(blob, "branded"), error: null };
    } catch (e) {
      console.error(e);
      return { url: null, error: (e as Error).message.slice(0, 280) };
    }
  }

  async function submit() {
    const price = Number(f.price);
    if (!f.name.trim() || !f.sku.trim() || !Number.isInteger(price)) return toast.error("Name, SKU and a whole-number price are required");
    setBusy(true);
    try {
      const res = await save({
        data: {
          ...(id ? { id } : {}),
          name: f.name, name_hi: f.name_hi || null, zodiac_sign_id: f.zodiac_sign_id, sku: f.sku,
          stones: f.stones || null, short_description: f.short_description || null, description: f.description || null,
          product_info: f.product_info || null, original_price: f.original_price ? Number(f.original_price) : null,
          price, stock: Number(f.stock) || 0, low_stock_threshold: Number(f.low_stock_threshold) || 0,
          status: f.status, featured: f.featured, apply_branding: f.apply_branding,
        },
      });
      setId(res.id);
      let brandingFailed = false;
      for (const [i, file] of pending.entries()) {
        // Original is always stored first and never modified.
        const original = await uploadProductFile(file, "originals");
        const branded = await brandAndUpload(file);
        if (branded.error) brandingFailed = true;
        await addImg({ data: { product_id: res.id, original_image_url: original, branded_image_url: branded.url, branding_error: branded.error, is_primary: images.length === 0 && i === 0 } });
      }
      setPending([]);
      onSaved();
      if (brandingFailed) toast.warning("Product saved. Branded image could not be generated.");
      else toast.success("Bracelet saved");
      if (!brandingFailed) onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function retry(img: AdminImage) {
    setBusy(true);
    const b = await brandAndUpload(img.original_image_url);
    await updImg({ data: { id: img.id, branded_image_url: b.url, branding_error: b.error } });
    setBusy(false);
    onSaved();
    if (b.error) toast.error("Branded image could not be generated."); else toast.success("Branding applied");
  }

  async function imageAction(img: AdminImage, action: "primary" | "remove") {
    await updImg({ data: action === "primary" ? { id: img.id, make_primary: true } : { id: img.id, remove: true } });
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-2xl">{product ? "Edit bracelet" : "Add bracelet"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Hindi product name"><Input value={f.name_hi} onChange={(e) => set("name_hi", e.target.value)} /></Field>
          <Field label="Zodiac sign (symbol is automatic)">
            <Select value={String(f.zodiac_sign_id)} onValueChange={(v) => set("zodiac_sign_id", Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ZODIAC_SIGNS.map((_, i) => <SelectItem key={i} value={String(i + 1)}>{signLabel(i + 1)}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="SKU / Product ID"><Input value={f.sku} onChange={(e) => set("sku", e.target.value)} /></Field>
          <Field label="Crystal / stone names" wide><Input value={f.stones} onChange={(e) => set("stones", e.target.value)} /></Field>
          <Field label="Short description" wide><Textarea rows={2} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} /></Field>
          <Field label="Full description" wide><Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
          <Field label="Benefits / product information" wide><Textarea rows={3} value={f.product_info} onChange={(e) => set("product_info", e.target.value)} /></Field>
          <Field label="Original price (₹, optional)"><Input inputMode="numeric" value={f.original_price} onChange={(e) => set("original_price", e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Selling price (₹)"><Input inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Stock quantity"><Input inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Low stock alert at"><Input inputMode="numeric" value={f.low_stock_threshold} onChange={(e) => set("low_stock_threshold", e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Product status">
            <Select value={f.status} onValueChange={(v) => set("status", v as FormState["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="flex flex-col gap-3 pt-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.featured} onCheckedChange={(v) => set("featured", v)} /> Featured product</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.apply_branding} onCheckedChange={(v) => set("apply_branding", v)} /> Apply ShivAmrit branding</label>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium text-ink">Photos</p>
          <p className="text-xs text-muted-foreground">The original is always kept. A separate copy with the logo is made automatically.</p>
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img) => (
                <div key={img.id} className="rounded border border-border p-2 text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    <figure><img src={img.original_image_url} alt="Original" className="aspect-square w-full rounded object-cover" /><figcaption className="mt-0.5 text-muted-foreground">Original</figcaption></figure>
                    <figure>{img.branded_image_url ? <img src={img.branded_image_url} alt="Branded" className="aspect-square w-full rounded object-cover" /> : <div className="grid aspect-square place-items-center rounded border border-dashed text-[10px] text-muted-foreground">None</div>}<figcaption className="mt-0.5 text-muted-foreground">Branded</figcaption></figure>
                  </div>
                  {img.branding_error && <p className="mt-1 text-destructive">Branded image could not be generated.</p>}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" disabled={busy} onClick={() => retry(img)}><RefreshCw className="size-3" /> {img.branding_error ? "Retry branding" : "Re-brand"}</Button>
                    {!img.is_primary && <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => imageAction(img, "primary")}>Make main</Button>}
                    {img.is_primary && <span className="self-center text-[11px] text-gold">Main photo</span>}
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" aria-label="Remove photo" onClick={() => imageAction(img, "remove")}><Trash2 className="size-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Input className="mt-3" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(e) => setPending(Array.from(e.target.files ?? []))} aria-label="Upload product photos" />
          {pending.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{pending.length} photo(s) will be uploaded on save{images.length === 0 ? "; the first becomes the main photo" : ""}.</p>}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="ink" disabled={busy} onClick={submit}>{busy ? "Saving…" : "Save bracelet"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={cn("grid gap-1.5", wide && "sm:col-span-2")}><Label className="text-xs">{label}</Label>{children}</div>;
}

/* ------------------------------------------------------- bulk import ----- */

function BulkImport({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const importFn = useServerFn(bulkImportProducts);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof parseBulk> | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = preview?.filter((r) => r.ok) ?? [];
  const bad = preview?.filter((r) => !r.ok) ?? [];

  async function run() {
    setBusy(true);
    try {
      const res = await importFn({ data: { rows: valid.map((r) => r.ok ? { name: r.name, zodiac_sign_id: r.zodiac_sign_id, price: r.price, stock: r.stock } : null!).filter(Boolean) } });
      toast.success(`${res.created} bracelet(s) imported as Draft — add photos and set Active to publish`);
      onDone();
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-2xl">Bulk import</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">One per line: <code>Name | sign (Hindi or English) | price | stock</code></p>
        <Textarea rows={6} value={text} onChange={(e) => { setText(e.target.value); setPreview(null); }} placeholder={"Scorpio Bracelet | वृश्चिक | 1499 | 10\nAries Bracelet | मेष | 1299 | 5"} />
        {!preview ? (
          <Button variant="ink" disabled={!text.trim()} onClick={() => setPreview(parseBulk(text))}>Show import preview</Button>
        ) : (
          <div>
            <p className="text-sm font-medium">Import preview — {valid.length} ready, {bad.length} with problems</p>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {preview.map((r) => (
                  <tr key={r.line} className={cn("border-t", !r.ok && "bg-destructive/5")}>
                    <td className="px-2 py-1 text-xs text-muted-foreground">#{r.line}</td>
                    {r.ok ? <><td className="px-2 py-1">{r.name}</td><td className="px-2 py-1">{r.signLabel}</td><td className="px-2 py-1">{formatINR(r.price)}</td><td className="px-2 py-1">{r.stock}</td></> : <td colSpan={4} className="px-2 py-1 text-destructive">{r.raw} — {r.error}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {bad.length > 0 && <p className="mt-2 text-xs text-destructive">Rows with problems will be skipped. Fix them above to include them.</p>}
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreview(null)}>Edit</Button>
              <Button variant="ink" disabled={busy || valid.length === 0} onClick={run}>{busy ? "Importing…" : `Import ${valid.length} as Draft`}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------- stock dialog ---- */

function StockDialog({ product, onClose, onDone }: { product: AdminProduct; onClose: () => void; onDone: () => void }) {
  const histFn = useServerFn(getStockHistory);
  const adjFn = useServerFn(adjustStock);
  const hist = useQuery({ queryKey: ["stock-history", product.id], queryFn: () => histFn({ data: { id: product.id } }) });
  const [stock, setStock] = useState(String(product.stock));
  const [reason, setReason] = useState("Manual count");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await adjFn({ data: { id: product.id, stock: Number(stock) || 0, reason } });
      toast.success("Stock updated");
      onDone();
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-2xl">Stock — {product.name}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="New stock"><Input inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Reason"><Input value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        </div>
        <Button variant="ink" disabled={busy} onClick={save}>Save stock</Button>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium"><History className="size-4" /> History</p>
          <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto text-xs">
            {(hist.data?.history ?? []).map((h) => (
              <li key={h.id} className="flex justify-between gap-2 border-b border-border py-1">
                <span>{new Date(h.created_at).toLocaleString("en-IN")} · {h.reason}</span>
                <span className={h.change < 0 ? "text-destructive" : "text-navy"}>{h.change > 0 ? `+${h.change}` : h.change} → {h.stock_after}</span>
              </li>
            ))}
            {hist.data?.history.length === 0 && <li className="text-muted-foreground">No changes yet.</li>}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
