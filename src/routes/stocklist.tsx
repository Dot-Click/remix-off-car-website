import { createFileRoute, Link } from "@tanstack/react-router";
import heroStocklist from "@/assets/hero-stocklist.jpg";
import { field, useMediaUrl, usePageSections } from "@/lib/site-content";
import { useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHero } from "@/components/site/PageHero";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Reveal } from "@/components/site/Reveal";
import {
  BODY_TYPES,
  COLOURS,
  DRIVE_TYPES,
  FUELS,
  MAKES,
  MODELS,
  TRANSMISSIONS,
  formatPrice,
} from "@/data/vehicles";
import { useCatalogue } from "@/lib/public-vehicles";

export type StockSearch = {
  make: string;
  model: string;
  maxPrice: number;
  minYear: number;
  maxMileage: number;
  transmission: string;
  fuel: string;
  body: string;
  colour: string;
  drive: string;
  sort: string;
  page: number;
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const PER_PAGE = 12;

export const Route = createFileRoute("/stocklist")({
  validateSearch: (search: Record<string, unknown>): StockSearch => ({
    make: str(search['make']),
    model: str(search['model']),
    maxPrice: num(search['maxPrice']),
    minYear: num(search['minYear']),
    maxMileage: num(search['maxMileage']),
    transmission: str(search['transmission']),
    fuel: str(search['fuel']),
    body: str(search['body']),
    colour: str(search['colour']),
    drive: str(search['drive']),
    sort: str(search['sort'], "newest"),
    page: Math.max(1, num(search['page'], 1)),

  }),
  head: () => ({
    meta: [
      { title: "Used Luxury Cars in Stock | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Search 100+ luxury and performance cars in stock. Filter by make, model, price, mileage, fuel and body type.",
      },
      { property: "og:title", content: "Used Luxury Cars in Stock | J1 Auto Trade" },
      { property: "og:description", content: "Search 100+ luxury and performance cars in stock." },
    ],
  }),
  component: Stocklist,
});

const EMPTY: StockSearch = {
  make: "",
  model: "",
  maxPrice: 0,
  minYear: 0,
  maxMileage: 0,
  transmission: "",
  fuel: "",
  body: "",
  colour: "",
  drive: "",
  sort: "newest",
  page: 1,
};

function Stocklist() {
  const sections = usePageSections("stocklist");
  const hero = sections["hero"];
  const heroImage = useMediaUrl(hero?.background_image_path ?? null, heroStocklist);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const set = (patch: Partial<StockSearch>) =>
    navigate({ search: (prev: StockSearch) => ({ ...prev, ...patch, page: patch.page ?? 1 }) });

  const catalogue = useCatalogue();

  const filtered = useMemo(() => {
    const list = catalogue.filter((v) => {
      if (search.make && v.make !== search.make) return false;
      if (search.model && v.model !== search.model) return false;
      if (search.maxPrice && v.price > search.maxPrice) return false;
      if (search.minYear && v.year < search.minYear) return false;
      if (search.maxMileage && v.mileage > search.maxMileage) return false;
      if (search.transmission && v.transmission !== search.transmission) return false;
      if (search.fuel && v.fuel !== search.fuel) return false;
      if (search.body && v.bodyType !== search.body) return false;
      if (search.colour && v.colour !== search.colour) return false;
      if (search.drive && v.driveType !== search.drive) return false;
      return true;
    });

    switch (search['sort']) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "mileage":
        return list.sort((a, b) => a.mileage - b.mileage);
      case "year":
        return list.sort((a, b) => b.year - a.year);
      default:
        return list.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    }
  }, [search, catalogue]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(search.page, pages);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeChips = (
    [
      ["make", search.make],
      ["model", search.model],
      ["body", search.body],
      ["fuel", search.fuel],
      ["transmission", search.transmission],
      ["colour", search.colour],
      ["drive", search.drive],
      ["maxPrice", search.maxPrice ? `Under ${formatPrice(search.maxPrice)}` : ""],
      ["minYear", search.minYear ? `${search.minYear}+` : ""],
      ["maxMileage", search.maxMileage ? `Under ${search.maxMileage.toLocaleString()} mi` : ""],
    ] as const
  ).filter(([, val]) => val);

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Stocklist"
        label={field(hero, "eyebrow", "Our Vehicles")}
        title={field(hero, "heading", "Find Your Next Car")}
        description={field(
          hero,
          "description",
          "Explore our latest selection of quality vehicles from trusted manufacturers — every car inspected across 165 points, warranted and available with finance or nationwide delivery.",
        )}
      />

      <section className="py-14">
        <div className="shell grid gap-10 lg:grid-cols-[290px_minmax(0,1fr)]">
          {/* Filters */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
                </h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-accent hover:underline"
                  onClick={() => navigate({ search: () => EMPTY })}
                >
                  Reset
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <Filter label="Make" value={search.make} onChange={(v) => set({ make: v, model: "" })} options={[...MAKES]} />
                <Filter
                  label="Model"
                  value={search.model}
                  onChange={(v) => set({ model: v })}
                  options={search.make ? (MODELS[search.make] ?? []) : []}
                  disabled={!search.make}
                />
                <Filter
                  label="Max Price"
                  value={search.maxPrice ? String(search.maxPrice) : ""}
                  onChange={(v) => set({ maxPrice: Number(v) || 0 })}
                  options={["20000", "35000", "50000", "80000", "150000"]}
                  format={(v) => `Under ${formatPrice(Number(v))}`}
                />
                <Filter
                  label="Min Year"
                  value={search.minYear ? String(search.minYear) : ""}
                  onChange={(v) => set({ minYear: Number(v) || 0 })}
                  options={["2019", "2021", "2022", "2023", "2024"]}
                />
                <Filter
                  label="Max Mileage"
                  value={search.maxMileage ? String(search.maxMileage) : ""}
                  onChange={(v) => set({ maxMileage: Number(v) || 0 })}
                  options={["10000", "25000", "50000", "75000"]}
                  format={(v) => `Under ${Number(v).toLocaleString()} mi`}
                />
                <Filter label="Fuel" value={search.fuel} onChange={(v) => set({ fuel: v })} options={[...FUELS]} />
                <Filter label="Transmission" value={search.transmission} onChange={(v) => set({ transmission: v })} options={[...TRANSMISSIONS]} />
                <Filter label="Colour" value={search.colour} onChange={(v) => set({ colour: v })} options={COLOURS} />
                <Filter label="Body Type" value={search.body} onChange={(v) => set({ body: v })} options={BODY_TYPES} />
                <Filter label="Drive Type" value={search.drive} onChange={(v) => set({ drive: v })} options={[...DRIVE_TYPES]} />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
              <p className="min-w-0 truncate text-sm text-muted-foreground">
                Showing {shown.length} of {filtered.length} vehicles
              </p>
              <Select value={search.sort} onValueChange={(v) => set({ sort: v })}>
                <SelectTrigger className="h-10 w-[190px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="mileage">Lowest mileage</SelectItem>
                  <SelectItem value="year">Newest year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {activeChips.map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      set({ [key]: typeof EMPTY[key] === "number" ? 0 : "" } as Partial<StockSearch>)
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    {val} <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            {shown.length === 0 ? (
              <div className="mt-14 rounded-2xl border border-dashed border-border p-16 text-center">
                <h3 className="font-display text-xl font-semibold">No vehicles match those filters</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening your budget or clearing a filter.
                </p>
                <Button className="mt-6" onClick={() => navigate({ search: () => EMPTY })}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((v, i) => (
                  <Reveal key={v.id} delay={(i % 6) * 50}>
                    <VehicleCard vehicle={v} />
                  </Reveal>
                ))}
              </div>
            )}

            {pages > 1 && (
              <nav className="mt-14 flex flex-wrap items-center justify-center gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => set({ page: page - 1 })}>
                  Previous
                </Button>
                {Array.from({ length: pages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={i + 1 === page ? "accent" : "outline"}
                    size="icon"
                    onClick={() => set({ page: i + 1 })}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" disabled={page === pages} onClick={() => set({ page: page + 1 })}>
                  Next
                </Button>
              </nav>
            )}

            <p className="mt-10 text-center text-sm text-muted-foreground">
              Can't find it?{" "}
              <Link to="/contact" className="font-semibold text-accent hover:underline">
                Tell us what you're looking for
              </Link>{" "}
              and we'll source it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
  format,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  format?: (v: string) => string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <Select value={value || "any"} onValueChange={(v) => onChange(v === "any" ? "" : v)} disabled={disabled ?? false}>
        <SelectTrigger className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any {label.toLowerCase()}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {format ? format(o) : o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
