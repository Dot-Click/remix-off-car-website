import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { VEHICLES } from "@/data/vehicles";
import suv from "@/assets/car-suv.jpg";
import sedan from "@/assets/car-sedan.jpg";
import coupe from "@/assets/car-coupe.jpg";
import convertible from "@/assets/car-convertible.jpg";
import pickup from "@/assets/car-pickup.jpg";
import hatchback from "@/assets/car-hatchback.jpg";
import electric from "@/assets/car-electric.jpg";
import hybrid from "@/assets/car-hybrid.jpg";

type Tile = {
  body: string;
  image: string;
  blurb: string;
  span: string;
  height: string;
};

const TILES: Tile[] = [
  {
    body: "SUV",
    image: suv,
    blurb: "Commanding presence, effortless comfort",
    span: "lg:col-span-4",
    height: "h-[320px] lg:h-[460px]",
  },
  {
    body: "Coupe",
    image: coupe,
    blurb: "Sculpted lines, pure driver focus",
    span: "lg:col-span-2",
    height: "h-[320px] lg:h-[460px]",
  },
  {
    body: "Sedan",
    image: sedan,
    blurb: "Executive refinement, quiet authority",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[340px]",
  },
  {
    body: "Convertible",
    image: convertible,
    blurb: "Open-top theatre on demand",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[340px]",
  },
  {
    body: "Electric",
    image: electric,
    blurb: "Silent torque, next-generation design",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[340px]",
  },
  {
    body: "Pickup",
    image: pickup,
    blurb: "Rugged capability, premium finish",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[300px]",
  },
  {
    body: "Hatchback",
    image: hatchback,
    blurb: "Compact footprint, serious pace",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[300px]",
  },
  {
    body: "Hybrid",
    image: hybrid,
    blurb: "Electrified efficiency, no compromise",
    span: "lg:col-span-2",
    height: "h-[280px] lg:h-[300px]",
  },
];

const countFor = (body: string) => VEHICLES.filter((v) => v.bodyType === body).length;

const searchFor = (body: string) => ({
  make: "",
  model: "",
  maxPrice: 0,
  minYear: 0,
  transmission: "",
  fuel: "",
  body,
  colour: "",
  drive: "",
  maxMileage: 0,
  sort: "newest",
  page: 1,
});

export function BodyTypeShowcase() {
  return (
    <section className="surface-ink py-24">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Explore Our Collection</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-5xl">
            Find Your Perfect Vehicle Style
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Browse vehicles by body type and find the right style for your lifestyle.
          </p>

        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {TILES.map((tile, i) => (
            <Reveal key={tile.body} delay={i * 70} className={tile.span}>
              <Link
                to="/stocklist"
                search={searchFor(tile.body)}
                className={`group relative flex ${tile.height} w-full flex-col justify-end overflow-hidden rounded-[20px] border border-white/10 shadow-float transition-all duration-700 hover:-translate-y-2 hover:border-accent/50 hover:glow-accent`}
              >
                <img
                  src={tile.image}
                  alt={`${tile.body} vehicles at J1 Auto Trade`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/15" />
                <span className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-gradient-to-t from-accent/35 via-transparent to-transparent" />

                <div className="relative flex items-end justify-between gap-4 p-6">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-semibold text-ink-foreground">
                      {tile.body}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      {countFor(tile.body)} vehicles available
                    </p>
                    <p className="mt-3 hidden text-xs tracking-wide text-ink-muted lg:block">
                      {tile.blurb}
                    </p>
                    <span className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 lg:-translate-y-1 lg:group-hover:translate-y-0">
                      Explore Vehicles
                      <span className="h-px w-8 bg-accent" />
                    </span>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-ink-foreground backdrop-blur-md transition-all duration-500 group-hover:border-transparent group-hover:bg-accent group-hover:-translate-y-1 group-hover:translate-x-1">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>

                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
