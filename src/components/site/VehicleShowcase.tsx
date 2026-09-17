import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Cog, Fuel, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMiles, formatPrice, type Vehicle } from "@/data/vehicles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * Large, image-led vehicle showcase with left/right arrows that step through
 * the stock one vehicle at a time. The whole image is a link to that
 * vehicle's detail page; an "Request Inquiry" CTA sits alongside.
 */
export function VehicleShowcase({
  vehicles,
  className,
}: {
  vehicles: Vehicle[];
  className?: string;
}) {
  if (!vehicles.length) return null;

  return (
    <Carousel opts={{ align: "start", loop: true, slidesToScroll: 1 }} className={cn("relative", className)}>
      <CarouselContent className="-ml-6">
        {vehicles.map((v) => (
          <CarouselItem key={v.id} className="basis-full pl-6 lg:basis-1/2">
            <ShowcaseSlide vehicle={v} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows — browse vehicles one by one */}
      <CarouselPrevious
        aria-label="Previous vehicle"
        className="left-2 top-[26%] h-12 w-12 sm:top-1/2 border-border bg-background/90 shadow-float backdrop-blur hover:bg-accent hover:text-accent-foreground sm:-left-5"
      />
      <CarouselNext
        aria-label="Next vehicle"
        className="right-2 top-[26%] h-12 w-12 sm:top-1/2 border-border bg-background/90 shadow-float backdrop-blur hover:bg-accent hover:text-accent-foreground sm:-right-5"
      />

    </Carousel>
  );
}

function ShowcaseSlide({ vehicle }: { vehicle: Vehicle }) {
  const sold = vehicle.status === "Sold";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:border-accent/40 hover:shadow-float">
      <Link
        to="/vehicle/$id"
        params={{ id: vehicle.id }}
        aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        className="relative block aspect-[16/9] overflow-hidden bg-secondary"
      >
        <img
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          width={1600}
          height={900}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur",
            vehicle.status === "Available" && "bg-background/85 text-foreground",
            vehicle.status === "Reserved" && "bg-accent/90 text-accent-foreground",
            sold && "bg-primary/85 text-primary-foreground",
          )}
        >
          {vehicle.status}
        </span>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            {vehicle.make} {vehicle.model}
          </p>
          <p className="mt-0.5 truncate text-sm text-white/80">{vehicle.variant}</p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
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

        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
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

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="group/cta">
            <Link to="/vehicle/$id" params={{ id: vehicle.id }}>
              View Vehicle
              <ArrowRight className="transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="accent">
            <Link to="/vehicle/$id" params={{ id: vehicle.id }} hash="enquire">
              Request Inquiry
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
