import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { stockSearch } from "@/lib/stock-search";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Car,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal, Counter } from "@/components/site/Reveal";
import { VehicleCard } from "@/components/site/VehicleCard";
import { BodyTypeShowcase } from "@/components/site/BodyTypeShowcase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


import {
  BODY_TYPES,
  MAKES,
  VEHICLES,
  MODELS,
  formatPrice,
} from "@/data/vehicles";
import { useFeaturedVehicles, useLatestVehicles } from "@/lib/public-vehicles";
import { field, listField, numberSetting, usePageSections, usePublishedTestimonials } from "@/lib/site-content";
import heroCar from "@/assets/hero-car.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import heroSlide4 from "@/assets/hero-slide-4.jpg";
import showroom from "@/assets/showroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J1 Auto Trade | Luxury & Performance Cars for Sale" },
      {
        name: "description",
        content:
          "Browse 100+ hand-selected luxury cars at J1 Auto Trade. Finance from 6.9% APR, 12-month warranty, part exchange and nationwide delivery.",
      },
      { property: "og:title", content: "J1 Auto Trade | Luxury & Performance Cars" },
      {
        property: "og:description",
        content: "100+ hand-selected luxury cars, in-house finance and nationwide delivery.",
      },
    ],
  }),
  component: Home,
});

const WHY = [
  { icon: Banknote, title: "Finance Available", copy: "Rates from 6.9% APR with decisions in under 60 seconds." },
  { icon: ShieldCheck, title: "12-Month Warranty", copy: "Comprehensive cover included on every vehicle we sell." },
  { icon: Wrench, title: "165-Point Inspection", copy: "Every car is inspected and prepared by our own technicians." },
  { icon: Car, title: "100+ Cars in Stock", copy: "One of the largest independent luxury collections in the North." },
  { icon: Truck, title: "Nationwide Delivery", copy: "Delivered to your door, fully valeted, within 72 hours." },
  { icon: BadgeCheck, title: "Trusted Dealer", copy: "4.9/5 from over 2,400 verified customer reviews." },
];

const REVIEWS = [
  { name: "Daniel Whitmore", role: "Range Rover Sport", stars: 5, text: "From the first enquiry to delivery on my driveway, J1 Auto Trade was flawless. The car was better than described and the finance took ten minutes." },
  { name: "Priya Raman", role: "Audi e-tron GT", stars: 5, text: "I've bought from main dealers for fifteen years — nothing came close to this experience. No pressure, total transparency." },
  { name: "Marcus Bell", role: "BMW M4 Competition", stars: 5, text: "They took my old car in part exchange at a genuinely fair price and had me in the M4 the same weekend." },
  { name: "Sophie Lang", role: "Tesla Model Y", stars: 5, text: "The photos don't do the prep work justice. It arrived immaculate, fully charged and with a full history pack." },
];

const HERO_SLIDES = [
  { src: heroCar, alt: "Black luxury coupe in a dark showroom" },
  { src: heroSlide2, alt: "Silver Mercedes-Benz S-Class in a luxury showroom" },
  { src: heroSlide3, alt: "Matte black Range Rover Sport in a premium dealership" },
  { src: heroSlide4, alt: "Blue BMW M4 Competition in a modern showroom" },
];

function Home() {
  const navigate = useNavigate();

  // CMS content (each field falls back to the original copy).
  const sections = usePageSections("home");
  const { data: featuredVehicles } = useFeaturedVehicles(6);
  const hero = sections["hero"];
  const featuredS = sections["featured"];
  const makesS = sections["makes"];
  const whyS = sections["why"];
  const financeS = sections["finance"];
  const reviewsS = sections["reviews"];
  const arrivalsS = sections["arrivals"];
  const ctaS = sections["cta"];
  const { data: latestVehicles } = useLatestVehicles(numberSetting(arrivalsS, "count", 4));

  const heroHeading = field(hero, "heading", "Find Your Next Car");
  const heroAccent = field(hero, "subheading", "Next Car");
  const heroLead = heroHeading.endsWith(heroAccent)
    ? heroHeading.slice(0, heroHeading.length - heroAccent.length).trim()
    : heroHeading;

  const cmsReviews = usePublishedTestimonials();
  const reviews = cmsReviews.length
    ? cmsReviews.map((t) => ({
        name: t.customer_name,
        role: t.vehicle ?? "",
        stars: t.rating ?? 5,
        text: t.review,
      }))
    : REVIEWS.map((r) => ({ name: r.name, role: r.role, stars: r.stars, text: r.text }));

  const [make, setMake] = useState("any");
  const [model, setModel] = useState("any");
  const [price, setPrice] = useState("any");
  const [year, setYear] = useState("any");
  const [transmission, setTransmission] = useState("any");
  const [fuel, setFuel] = useState("any");
  const [body, setBody] = useState("any");
  const [currentSlide, setCurrentSlide] = useState(0);

  const models = make !== "any" ? (MODELS[make] ?? []) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, numberSetting(hero, "autoplay_seconds", 5) * 1000);
    return () => clearInterval(timer);
  }, [hero]);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden max-lg:flex max-lg:min-h-0 max-lg:flex-col max-lg:bg-[#070707] max-sm:block max-sm:bg-[#070707]">
        <div className="absolute inset-0 bg-black max-lg:relative max-lg:inset-auto max-lg:h-[58svh] max-lg:w-full max-lg:flex-shrink-0 max-sm:absolute max-sm:inset-0 max-sm:h-full max-sm:w-full">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.alt}
              src={slide.src}
              alt={slide.alt}
              width={1920}
              height={1088}
              className={`hero-slide absolute inset-0 h-full w-full object-contain object-center transition-all duration-1000 ease-out ${
                idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
          <div
            className="hero-overlay absolute inset-0"
            aria-hidden
          />
        </div>

        <div className="shell relative flex min-h-[100svh] flex-col justify-center pb-16 pt-32 max-lg:min-h-0 max-lg:flex-1 max-lg:justify-start max-lg:pb-8 max-lg:pt-6 max-sm:min-h-[100svh] max-sm:justify-start max-sm:pb-16 max-sm:pt-28">
          <div className="max-w-3xl">
            <p className="eyebrow animate-fade-in">{field(hero, "eyebrow", `${BRAND.name} · Manchester`)}</p>
            <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.4rem)] font-normal leading-[0.95] text-ink-foreground animate-fade-in">
              {heroLead}
              <br />
              <span className="text-accent font-800">{heroAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg animate-fade-in">
              {field(
                hero,
                "description",
                "Explore our collection of quality vehicles from trusted brands — each inspected, warranted for 12 months and delivered anywhere in the UK.",
              )}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link to={field(hero, "button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
                  {field(hero, "button_text", "Browse Our Stock")} <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="glass">
                <Link to={field(hero, "secondary_button_url", "/sell-your-car") as "/sell-your-car"}>
                  {field(hero, "secondary_button_text", "Sell Your Car")}
                </Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-foreground/85">
              {listField(hero, ["100+ Vehicles", "Quality Checked", "Finance Available", "Trusted Dealer"]).map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-accent" />
                    {t}
                  </li>
                ),
              )}
            </ul>
          </div>


          {/* Advanced search */}
          <div className="glass-dark mt-12 rounded-2xl p-4 sm:p-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
              Search our stock
            </p>
            <div className="grid gap-4 lg:grid-cols-9">
              <SearchSelect label="Make" value={make} onChange={(v) => { setMake(v); setModel("any"); }} options={["any", ...MAKES]} />
              <SearchSelect label="Model" value={model} onChange={setModel} options={["any", ...models]} />
              <SearchSelect label="Max Price" value={price} onChange={setPrice} options={["any", "20000", "35000", "50000", "80000", "150000"]} format={(v) => (v === "any" ? "Any price" : formatPrice(Number(v)))} />
              <SearchSelect label="Body Type" value={body} onChange={setBody} options={["any", ...BODY_TYPES]} />
              <SearchSelect label="Min Year" value={year} onChange={setYear} options={["any", "2019", "2021", "2023", "2024"]} />
              <SearchSelect label="Transmission" value={transmission} onChange={setTransmission} options={["any", "Automatic", "Manual"]} />
              <SearchSelect label="Fuel" value={fuel} onChange={setFuel} options={["any", "Petrol", "Diesel", "Hybrid", "Electric"]} />
              <div className="flex items-end lg:col-span-2">
                <Button
                  variant="accent"
                  className="h-11 w-full min-w-[160px] justify-center gap-2.5 whitespace-nowrap rounded-lg px-12 text-sm font-semibold [&_svg]:shrink-0"
                  onClick={() =>
                    navigate({
                      to: "/stocklist",
                      search: stockSearch({
                        make: make === "any" ? "" : make,
                        model: model === "any" ? "" : model,
                        maxPrice: price === "any" ? 0 : Number(price),
                        minYear: year === "any" ? 0 : Number(year),
                        transmission: transmission === "any" ? "" : transmission,
                        fuel: fuel === "any" ? "" : fuel,
                        body: body === "any" ? "" : body,
                      }),
                    })
                  }
                >
                  <Search /> Search Vehicles
                </Button>
              </div>
            </div>
          </div>


          {/* Floating stats */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: <Counter to={108} suffix="+" />, label: "Cars in stock" },
              { value: <Counter to={10000} suffix="+" />, label: "Happy customers" },
              { value: "6.9%", label: "Finance from APR" },
              { value: "4.9/5", label: "Trusted dealer rating" },
            ].map((s, i) => (
              <div key={i} className="glass-dark px-5 py-4">
                <p className="font-display text-2xl font-bold text-ink-foreground">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute bottom-8 left-0 right-0 z-10 max-lg:hidden">
          <div className="shell flex items-center justify-between">
            <div className="flex gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-accent hover:border-accent"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-accent hover:border-accent"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{field(featuredS, "eyebrow", "The Collection")}</p>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                {field(featuredS, "heading", "Featured Vehicles")}
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/stocklist" search={stockSearch()}>
                {field(featuredS, "button_text", "View all stock")} <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* BRANDS */}
      <section className="bg-secondary py-24">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow">{field(makesS, "eyebrow", "Marques")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {field(makesS, "heading", "Browse by Make")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              {field(makesS, "description", "Hand-selected stock from the manufacturers our customers trust most.")}
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MAKES.map((m, i) => (
              <Reveal key={m} delay={i * 40}>
                <Link
                  to="/stocklist"
                  search={stockSearch({ make: m })}
                  className="group relative flex h-32 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent hover:shadow-float"
                >
                  <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="font-display text-lg font-semibold transition-colors group-hover:text-accent">
                    {m === "Mercedes" ? "Mercedes-Benz" : m}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {VEHICLES.filter((v) => v.make === m).length} vehicles
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    View stock <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* BODY TYPES */}
      <BodyTypeShowcase />


      {/* WHY */}
      <section className="surface-ink py-24">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{field(whyS, "eyebrow", "The J1 Standard")}</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-ink-foreground sm:text-5xl">
              {field(whyS, "heading", "Why thousands choose us over the main dealer")}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="glass-dark h-full p-7 transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="grid h-12 w-12 place-items-center rounded-xl accent-gradient text-accent-foreground">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{w.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCE */}
      <section className="py-24">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="zoom-media rounded-3xl">
            <img
              src={showroom}
              alt="J1 Auto Trade showroom interior"
              loading="lazy"
              width={1600}
              height={1000}
              className="h-full w-full rounded-3xl object-cover shadow-float"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">{field(financeS, "eyebrow", "Finance")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {financeS?.heading ? (
                financeS.heading
              ) : (
                <>
                  Drive away from <span className="text-accent">£249</span> per month
                </>
              )}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              {field(
                financeS,
                "description",
                "We work with 22 lenders to find the sharpest rate for your circumstances — including PCP, HP and lease purchase. Soft-search quotes leave no mark on your credit file.",
              )}
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {listField(financeS, ["Decision in 60 seconds", "No deposit options", "Terms from 24–60 months", "Settle early, penalty free"]).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link to="/finance">{field(financeS, "button_text", "Finance Calculator")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/finance">{field(financeS, "secondary_button_text", "Apply for Finance")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-secondary py-24">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow">{field(reviewsS, "eyebrow", "Reviews")}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {field(reviewsS, "heading", "Loved by 10,000+ drivers")}
            </h2>
          </Reveal>
          <Carousel opts={{ align: "start", loop: true }} className="mt-12">
            <CarouselContent className="-ml-5">
              {reviews.map((r) => (
                <CarouselItem key={r.name} className="pl-5 sm:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft">
                    <Quote className="h-7 w-7 shrink-0 text-accent" />
                    <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                      {r.text}
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full accent-gradient font-semibold text-accent-foreground">
                        {r.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{r.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.role}</p>
                      </div>
                      <span className="ml-auto flex shrink-0 gap-0.5">
                        {Array.from({ length: r.stars }).map((_, s) => (
                          <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </span>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-3">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>

        </div>
      </section>

      {/* LATEST */}
      <section className="py-24">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{field(arrivalsS, "eyebrow", "Just landed")}</p>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                {field(arrivalsS, "heading", "Latest Arrivals")}
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/stocklist" search={stockSearch()}>
                {field(arrivalsS, "button_text", "See everything")}
              </Link>
            </Button>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {latestVehicles.map((v, i) => (
              <Reveal key={v.id} delay={i * 50}>
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="shell">
          <Reveal className="relative overflow-hidden rounded-3xl surface-ink px-8 py-20 text-center">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full accent-gradient opacity-25 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-semibold text-ink-foreground sm:text-5xl">
                {field(ctaS, "heading", "Ready to buy your next car?")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-muted">
                {field(ctaS, "description", "Reserve online for £199, or speak to a specialist seven days a week.")}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="xl" variant="accent">
                  <Link to="/stocklist" search={stockSearch()}>
                    {field(ctaS, "button_text", "Browse Stock")}
                  </Link>
                </Button>
                <Button asChild size="xl" variant="glass">
                  <Link to="/contact">{field(ctaS, "secondary_button_text", "Contact Us")}</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SearchSelect({
  label,
  value,
  onChange,
  options,
  format,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  format?: (v: string) => string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 border-ink-border bg-white/5 text-ink-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o === "any" ? `Any ${label.toLowerCase()}` : format ? format(o) : o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
