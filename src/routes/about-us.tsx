import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Compass,
  HeartHandshake,
  Repeat,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Counter } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { stockSearch } from "@/lib/stock-search";
import { BRAND } from "@/lib/brand";
import showroom from "@/assets/showroom.jpg";
import heroStocklist from "@/assets/hero-stocklist.jpg";
import heroServices from "@/assets/hero-services.jpg";
import { cardsField, field, listField, usePageSections, useMediaUrl } from "@/lib/site-content";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us | J1 Auto Trade" },
      {
        name: "description",
        content:
          "J1 Auto Trade is an independent UK dealership built on quality vehicles, transparent pricing and honest advice about every car we sell.",
      },
      { property: "og:title", content: "About Us | J1 Auto Trade" },
      { property: "og:description", content: "Driven by quality. Built on trust." },
    ],
  }),
  component: AboutUs,
});

type Stat = { value: number; suffix: string; label: string };

const STATS: Stat[] = [
  { value: 100, suffix: "+", label: "Vehicles in stock" },
  { value: 500, suffix: "+", label: "Happy customers" },
  { value: 5, suffix: "-Star", label: "Rated service" },
  { value: 165, suffix: "-Point", label: "Quality checked" },
];

type WhyCard = { title: string; text: string };

const WHY: WhyCard[] = [
  { title: "Quality Vehicles", text: "Every car passes a 165-point inspection, full history check and workshop preparation before it goes on sale." },
  { title: "Transparent Pricing", text: "The price you see is the price you pay. No admin fees, no preparation charges, no surprises at handover." },
  { title: "Flexible Finance", text: "PCP, HP and lease purchase from a panel of 22 lenders, with soft-search quotes that don't mark your credit file." },
  { title: "Part Exchange", text: "A fair, same-day offer on your current car that can go straight into your deposit." },
  { title: "Customer Support", text: "A named contact from first enquiry through to years after handover — not a call centre queue." },
  { title: "Warranty Options", text: "12 months' cover as standard with extended plans and nationwide repairs available." },
];

const WHY_ICONS = [BadgeCheck, ShieldCheck, Wallet, Repeat, HeartHandshake, Sparkles];

const COMMITMENT_ITEMS = [
  "165-point mechanical inspection",
  "Full HPI and mileage verification",
  "Fresh MOT and service where due",
  "12 months' warranty as standard",
  "Nationwide delivery available",
  "Aftercare from a named advisor",
];

function AboutUs() {
  const sections = usePageSections("about-us");
  const hero = sections["hero"];
  const stats = sections["stats"];
  const story = sections["story"];
  const commitment = sections["commitment"];
  const why = sections["why"];
  const cta = sections["cta"];

  const heroImage = useMediaUrl(hero?.background_image_path, showroom);
  const storyImage = useMediaUrl(story?.image_path, heroStocklist);
  const commitmentImage = useMediaUrl(commitment?.image_path, heroServices);

  const statCards = cardsField<Stat>(stats, STATS);
  const missionCards = cardsField<WhyCard>(story, [
    { title: "Our mission", text: "To make buying, financing and part-exchanging a car straightforward, transparent and genuinely enjoyable — with the full condition of every vehicle on the table before anyone signs anything." },
  ]);
  const mission = missionCards[0];
  const commitmentItems = listField(commitment, COMMITMENT_ITEMS);
  const whyCards = cardsField<WhyCard>(why, WHY);

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="About Us"
        label={field(hero, "eyebrow", "About J1 Auto Trade")}
        title={field(hero, "heading", "Driven By Quality. Built On Trust.")}
        description={field(
          hero,
          "description",
          "An independent dealership where every vehicle is chosen, prepared and described the way we'd want it done for ourselves.",
        )}
      >
        <Button asChild variant="accent" size="lg">
          <Link to={field(hero, "button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
            {field(hero, "button_text", "Explore Our Stock")}
          </Link>
        </Button>
      </PageHero>

      <section className="border-b border-border py-14">
        <div className="shell grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} className="text-center">
              <p className="font-display text-4xl font-semibold text-accent sm:text-5xl">
                <Counter to={Number(s.value)} />
                {s.suffix}
              </p>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="zoom-media overflow-hidden rounded-3xl">
            <img
              src={storyImage}
              alt="J1 Auto Trade forecourt"
              loading="lazy"
              width={1600}
              height={900}
              className="h-full w-full object-cover shadow-float"
            />
          </Reveal>
          <Reveal delay={100} className="space-y-10">
            <div>
              <p className="eyebrow">{field(story, "eyebrow", "Our story")}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                {field(story, "heading", "Built one honest handover at a time")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {field(
                  story,
                  "description",
                  "J1 Auto Trade started with a handful of carefully chosen cars and a simple belief: buying a used vehicle should feel as good as driving one. Today we hold over 100 vehicles at our Birmingham site, and the approach hasn't changed — we only sell cars we would happily put a member of our own family in.",
                )}
              </p>
            </div>
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <Compass className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">{mission?.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{mission?.text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="lg:order-2 zoom-media overflow-hidden rounded-3xl">
            <img
              src={commitmentImage}
              alt="Vehicle preparation workshop"
              loading="lazy"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">{field(commitment, "eyebrow", "Our commitment")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-foreground sm:text-4xl">
              {field(commitment, "heading", "Prepared properly, priced fairly, backed afterwards")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              {field(
                commitment,
                "description",
                "Preparation happens in our own workshop, pricing is checked daily against live market data, and support continues long after you drive away. If something isn't right, we fix it — that's the whole commitment.",
              )}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {commitmentItems.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-ink-foreground">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{field(why, "eyebrow", "Why choose us")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              {field(why, "heading", `Why customers choose ${BRAND.nameTitle}`)}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length]!;
              return (
                <Reveal key={w.title} delay={(i % 3) * 80}>
                  <div className="h-full rounded-[20px] border border-border bg-card p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-float">
                    <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="shell">
          <Reveal className="glass-card rounded-3xl border border-border p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {field(cta, "heading", "Ready to find your next car?")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {field(cta, "description", `Browse the current stock list or come and see us at ${BRAND.address}.`)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to={field(cta, "button_url", "/stocklist") as "/stocklist"} search={stockSearch()}>
                  {field(cta, "button_text", "Explore Our Stock")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={field(cta, "secondary_button_url", "/find-us") as "/find-us"}>
                  {field(cta, "secondary_button_text", "Find Us")}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
