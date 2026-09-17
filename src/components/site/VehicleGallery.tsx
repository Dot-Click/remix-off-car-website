import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Main image + thumbnail gallery with arrows and cursor-anchored zoom.
 * Hover (or tap the zoom badge) magnifies the main photo; the pointer
 * position stays under the magnifier so it tracks like a loupe.
 */
export function VehicleGallery({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const photos = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActive(0);
  }, [photos[0]]);

  if (!photos.length) return null;

  const count = photos.length;
  const step = (dir: number) => {
    setZoomed(false);
    setActive((i) => (i + dir + count) % count);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className={cn("min-w-0", className)}>
      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={() => setZoomed(false)}
        className="group relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-soft"
      >
        <img
          src={photos[active]}
          alt={`${alt} photo ${active + 1} of ${count}`}
          width={1200}
          height={800}
          onClick={() => setZoomed((v) => !v)}
          style={{
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: zoomed ? "scale(2.2)" : "scale(1)",
          }}
          className="aspect-[16/10] w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-float backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-float backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          aria-pressed={zoomed}
          onClick={() => setZoomed((v) => !v)}
          className={cn(
            "absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest shadow-soft backdrop-blur transition-colors",
            zoomed
              ? "bg-accent text-accent-foreground"
              : "bg-background/90 text-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <ZoomIn className="h-3.5 w-3.5" /> {zoomed ? "Zoom out" : "Zoom"}
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-foreground backdrop-blur">
          {active + 1} / {count}
        </span>
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {photos.map((g, i) => (
            <button
              key={`${g}-${i}`}
              type="button"
              onClick={() => {
                setZoomed(false);
                setActive(i);
              }}
              aria-label={`View photo ${i + 1}`}
              className={cn(
                "overflow-hidden rounded-xl border-2 transition-all",
                i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={g} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
