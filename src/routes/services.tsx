import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  Car,
  Coins,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { stockSearch } from "@/lib/stock-search";
import { BRAND } from "@/lib/brand";
import heroServices from "@/assets/hero-services.jpg";
import showroom from "@/assets/showroom.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carCoupe from "@/assets/car-coupe.jpg";
import carElectric from "@/assets/car-electric.jpg";
import carHybrid from "@/assets/car-hybrid.jpg";
import carConvertible from "@/assets/car-convertible.jpg";
import carHatchback from "@/assets/car-hatchback.jpg";
import carPickup from "@/assets/car-pickup.jpg";
import { cardsField, field, usePageSections, useMediaUrl } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Dealership Services | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Vehicle sales, sourcing, finance, part exchange, valuation, warranty, preparation and after-sales support from J1 Auto Trade.",
      },
      { property: "og:title", content: "Dealership Services | J1 Auto Trade" },
      {
        property: "og:description",
        content: "Everything from sourcing your next car to keeping it in excellent condition.",
      },
    ],
  }),
  component: Services,
});

type ServiceCard = { title: string; text: string; image: string; url: string };

const SERVICES: ServiceCard[] = [
  { title: "Vehicle Sales", image: carSuv, text: "Over 100 hand-selected vehicles, each inspected, prepared and honestly described.", url: "/stocklist" },
  { title: "Vehicle Sourcing", image: carCoupe, text: "Tell us the exact specification you want and we'll find it through our trade network.", url: "/contact" },
  { title: "Finance", image: carSedan, text: "PCP, HP and lease purchase from a panel of 22 lenders with soft-search quotes.", url: "/finance" },
  { title: "Part Exchange", image: carHatchback, text: "Use your current car as your deposit with a same-day, no-obligation offer.", url: "/part-exchange" },
  { title: "Vehicle Valuation", image: carElectric, text: "A fair, market-accurate figure for your vehicle within one working hour.", url: "/valuation" },
  { title: "Warranty", image: carHybrid, text: "12 months' cover as standard with extended protection options available.", url: "/warranty" },
  { title: "After-Sales Support", image: carConvertible, text: "A named contact after handover for servicing, claims and any question at all.", url: "/find-us" },
  { title: "Vehicle Preparation", image: carPickup, text: "165-point inspection, full valet, fresh MOT and service before every handover.", url: "/about-us" },
];

const SERVICE_ICONS = [Car, Search, Wallet, Repeat, Coins, ShieldCheck, Headphones, Sparkles];

type SplitCard = { title: string; text: string };

const SPLITS_FALLBACK: { title: string; copy: string; image: string; points: string[] }[] = [
  {
    title: "Sourcing done properly",
    copy: "If it isn't on the forecourt, we'll find it. Our buyers work auctions, main-dealer part exchanges and private collections daily, so the exact colour, spec and mileage you want is usually only days away.",
    image: showroom,
    points: ["Nationwide trade network", "No fee until you approve the car", "Full history check on every find"],
  },
  {
    title: "Prepared to a standard you can see",
    copy: "Every vehicle goes through our workshop before it reaches the display floor: mechanical inspection, brake and tyre assessment, diagnostics, paint correction and a full valet inside and out.",
    image: heroServices,
    points: ["165-point inspection", "Fresh service and MOT where due", "Professional paint and interior detail"],
  },
];

function ServiceImage({ path, fallback, alt }: { path?: string | null; fallback: string; alt: string }) {
  const src = useMediaUrl(path, fallback);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={800}
      height={500}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
  );
}

function SplitImage({ path, fallback, alt }: { path?: string | null; fallback: string; alt: string }) {
  const src = useMediaUrl(path, fallback);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={1600}
      height={1000}
      className="h-full w-full object-cover shadow-float"
    />
  );
}

function Services() {
  const sections = usePageSections("services");
  const hero = sections["hero"];
  const intro = sections["intro"];
  const servicesS = sections["services"];
  const processS = sections["process"];
  const cta = sections["cta"];

  const heroImage = useMediaUrl(hero?.background_image_path, heroServices);

  const servicesIsCms =
    Array.isArray(servicesS?.items) &&
    (servicesS!.items as unknown[]).length > 0 &&
    (servicesS!.items as unknown[]).every((i) => i !== null && typeof i === "object" && !Array.isArray(i));
  const serviceCards = cardsField<ServiceCard>(servicesS, SERVICES);
  const processCards = cardsField<SplitCard>(
    processS,
    SPLITS_FALLBACK.map((s) => ({ title: s.title, text: s.copy })),
  );

  const splits = SPLITS_FALLBACK.map((fallback, i) => ({
    ...fallback,
    title: processCards[i]?.title ?? fallback.title,
    copy: processCards[i]?.text ?? fallback.copy,
  }));

  void intro;

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Services"
        label={field(hero, "eyebrow", "Our Services")}
        title={field(hero, "heading", "More Than Just A Car Dealership")}
        description={field(
          hero,
          "description",
          "From finding your next vehicle to keeping it in excellent condition, we're here to help.",
        )}
      >
        <Button asChild variant="accent" size="lg">
          <Link to={field(hero, "button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
            {field(hero, "button_text", "Browse Our Stock")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/contact">Talk To Our Team</Link>
        </Button>
      </PageHero>

      <section className="py-20">
        <div className="shell">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((s, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]!;
              const to = (s.url || "/stocklist") as any;
              return (
                <Reveal key={s.title} delay={(i % 4) * 70}>
                  <Link
                    to={to}
                    search={(s.url === "/stocklist" || !s.url ? stockSearch() : undefined) as any}
                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-float"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <ServiceImage
                        path={servicesIsCms ? s.image ?? null : null}
                        fallback={SERVICES[i % SERVICES.length]?.image ?? s.image}
                        alt={s.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-xl accent-gradient text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Learn more
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {splits.map((split, i) => (
        <section key={split.title} className={i % 2 ? "surface-ink py-20" : "py-20"}>
          <div className="shell grid items-center gap-12 lg:grid-cols-2">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <div className="zoom-media overflow-hidden rounded-3xl">
                <SplitImage path={null} fallback={split.image} alt={split.title} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2
                className={`font-display text-3xl font-semibold sm:text-4xl ${i % 2 ? "text-ink-foreground" : ""}`}
              >
                {split.title}
              </h2>
              <p className={`mt-4 leading-relaxed ${i % 2 ? "text-ink-muted" : "text-muted-foreground"}`}>
                {split.copy}
              </p>
              <ul className="mt-7 space-y-3">
                {split.points.map((p) => (
                  <li key={p} className={`flex items-center gap-3 text-sm ${i % 2 ? "text-ink-foreground" : ""}`}>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="pb-24">
        <div className="shell">
          <Reveal className="glass-card rounded-3xl border border-border p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {field(cta, "heading", "Need Help Finding The Right Vehicle?")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {field(
                cta,
                "description",
                `Our team will match your budget, mileage and specification to the right car — or source it for you. Call ${BRAND.phone} or send us a message.`,
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to={field(cta, "button_url", "/contact") as "/contact"}>
                  {field(cta, "button_text", "Contact Us")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={BRAND.phoneHref}>{BRAND.phone}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
