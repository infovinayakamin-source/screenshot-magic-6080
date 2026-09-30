import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
  productId: string;
};

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="flex items-center justify-center gap-2 border-t border-border py-3">
      <Button type="button" variant="outline" size="icon" onClick={() => zoomOut()} aria-label="Zoom out" title="Zoom out"><Minus /></Button>
      <Button type="button" variant="outline" size="icon" onClick={() => resetTransform()} aria-label="Reset zoom" title="Reset zoom"><RotateCcw /></Button>
      <Button type="button" variant="outline" size="icon" onClick={() => zoomIn()} aria-label="Zoom in" title="Zoom in"><Plus /></Button>
    </div>
  );
}

export function ProductGallery({ images, name, productId }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const current = images[active] ?? images[0];

  useEffect(() => {
    setActive(0);
    setOpen(false);
  }, [productId]);

  useEffect(() => {
    if (!open || count < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + count) % count);
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % count);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count]);

  if (!current) return null;

  const navigate = (direction: number) => setActive((index) => (index + direction + count) % count);

  return (
    <div className="min-w-0">
      <div className="group relative aspect-square overflow-hidden rounded-md border border-border bg-card">
        <img
          key={current}
          src={current}
          alt={`${name} — photo ${active + 1} of ${count}`}
          width={1200}
          height={1200}
          fetchPriority="high"
          className="size-full object-contain motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
        />
        <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
          {active + 1} / {count}
        </span>
        <Button
          type="button" variant="outline" size="icon"
          onClick={() => setOpen(true)} aria-label={`Zoom into ${name} photo ${active + 1}`} title="Zoom image"
          className="absolute bottom-3 right-3 size-10 border-border bg-background/95 text-navy shadow-sm hover:bg-gold hover:text-gold-foreground"
        >
          <Maximize2 />
        </Button>
        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <Button type="button" variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Previous photo" title="Previous photo" className="pointer-events-auto size-9 border-border bg-background/95 text-navy shadow-sm hover:bg-gold hover:text-gold-foreground"><ChevronLeft /></Button>
            <Button type="button" variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Next photo" title="Next photo" className="pointer-events-auto size-9 border-border bg-background/95 text-navy shadow-sm hover:bg-gold hover:text-gold-foreground"><ChevronRight /></Button>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:gap-3" aria-label="Product photo thumbnails">
          {images.map((image, index) => (
            <Button
              key={`${image}-${index}`}
              type="button" variant="outline" onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${name}`} aria-pressed={index === active}
              className={cn("size-16 shrink-0 overflow-hidden rounded-sm border p-0 transition-colors sm:size-20", index === active ? "border-navy ring-1 ring-navy" : "border-border hover:border-gold")}
            >
              <img src={image} alt="" loading="lazy" className="size-full object-contain" />
            </Button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[min(90dvh,900px)] w-[calc(100vw-1rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-md border-border bg-background p-0 sm:w-[calc(100vw-3rem)]">
          <DialogTitle className="shrink-0 border-b border-border px-4 py-4 pr-12 font-display text-lg text-navy sm:text-xl">{name} <span className="ml-2 font-sans text-xs text-muted-foreground">{active + 1} / {count}</span></DialogTitle>
          <div className="relative min-h-0 flex-1 bg-card">
            <TransformWrapper key={current} minScale={1} maxScale={5} centerOnInit wheel={{ step: 0.1 }} doubleClick={{ step: 1.4 }}>
              <TransformComponent wrapperClass="!h-full !w-full" contentClass="!h-full !w-full">
                <img src={current} alt={`${name} — enlarged photo ${active + 1} of ${count}`} className="h-full w-full select-none object-contain" draggable={false} />
              </TransformComponent>
              <div className="absolute bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm"><ZoomControls /></div>
            </TransformWrapper>
            {count > 1 && (
              <div className="pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between sm:inset-x-4">
                <Button type="button" variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Previous enlarged photo" title="Previous photo" className="pointer-events-auto size-10 bg-background/95 text-navy shadow-sm"><ChevronLeft /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Next enlarged photo" title="Next photo" className="pointer-events-auto size-10 bg-background/95 text-navy shadow-sm"><ChevronRight /></Button>
              </div>
            )}
          </div>
          {count > 1 && (
            <div className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-border px-4 py-2">
              {images.map((image, index) => (
                <Button key={`${image}-${index}`} type="button" variant="outline" onClick={() => setActive(index)} aria-label={`Enlarge photo ${index + 1}`} aria-pressed={index === active} className={cn("size-12 shrink-0 overflow-hidden rounded-sm p-0", index === active ? "border-navy ring-1 ring-navy" : "border-border")}>
                  <img src={image} alt="" className="size-full object-contain" />
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}