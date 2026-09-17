import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Cog, CalendarDays, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMiles, formatPrice, type Vehicle } from "@/data/vehicles";
import { useWishlist } from "@/lib/wishlist";

export function VehicleCard({ vehicle, className }: { vehicle: Vehicle; className?: string }) {
  const { has, toggle } = useWishlist();
  const saved = has(vehicle.id);
  const sold = vehicle.status === "Sold";
  const canBuyOnline = vehicle.onlinePurchase !== false && vehicle.status === "Available";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-float",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />

        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur",
              vehicle.status === "Available" && "bg-background/85 text-foreground",
              vehicle.status === "Reserved" && "bg-accent/90 text-accent-foreground",
              vehicle.status === "Sold" && "bg-primary/85 text-primary-foreground",
            )}
          >
            {vehicle.status}
          </span>
          {vehicle.featured && vehicle.status === "Available" && (
            <span className="rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground backdrop-blur">
              Featured
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove from favourites" : "Save to favourites"}
          onClick={() => toggle(vehicle.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-accent-foreground"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{vehicle.variant}</p>
        </div>

        <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-accent" />
            {vehicle.year}
          </li>
          <li className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-accent" />
            {formatMiles(vehicle.mileage)}
          </li>
          <li className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5 shrink-0 text-accent" />
            {vehicle.fuel}
          </li>
          <li className="flex items-center gap-1.5">
            <Cog className="h-3.5 w-3.5 shrink-0 text-accent" />
            {vehicle.transmission}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="font-display text-2xl font-semibold">{formatPrice(vehicle.price)}</p>
            <p className="text-xs text-muted-foreground">
              or {formatPrice(vehicle.monthly)}/mo finance
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {vehicle.bodyType}
          </span>
        </div>

        <div className={cn("grid gap-2", sold ? "grid-cols-1" : "grid-cols-2")}>
          <Button asChild variant="outline" className="group/cta">
            <Link to="/vehicle/$id" params={{ id: vehicle.id }}>
              View Vehicle
              <ArrowRight className="transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Link>
          </Button>
          {!sold &&
            (canBuyOnline ? (
              <Button asChild>
                <Link to="/checkout/$id" params={{ id: vehicle.id }} search={{ mode: "full" }}>
                  Buy Now
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/vehicle/$id" params={{ id: vehicle.id }} hash="enquire">
                  Enquire
                </Link>
              </Button>
            ))}
        </div>
      </div>
    </article>
  );
}
