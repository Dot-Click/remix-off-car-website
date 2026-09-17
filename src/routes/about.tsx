import { createFileRoute, Link } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { Award, Building2, HeartHandshake, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Counter } from "@/components/site/Reveal";
import showroom from "@/assets/showroom.jpg";
import hero from "@/assets/hero-car.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About J1 Auto Trade | Independent Luxury Motor Group" },
      {
        name: "description",
        content:
          "Founded in 2009, J1 Auto Trade is an independent luxury motor group in Manchester with 100+ cars, 38 specialists and 10,000 happy customers.",
      },
      { property: "og:title", content: "About J1 Auto Trade" },
      { property: "og:description", content: "An independent luxury motor group founded in Manchester in 2009." },
    ],
  }),
  component: About,
});

const TEAM = [
  ["Elena Vasquez", "Founder & Managing Director"],
  ["James Okafor", "Head of Sales"],
  ["Rhea Kapoor", "Finance Director"],
  ["Tom Ashworth", "Master Technician"],
];

function About() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-32 surface-ink">
        <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="shell relative max-w-3xl">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-foreground sm:text-6xl">
            Sixteen years of doing it properly
          </h1>
          <p className="mt-5 text-ink-muted">
            J1 Auto Trade began in 2009 with four cars on a Manchester forecourt and a simple idea: sell
            the sort of car you'd want to keep, and be honest about every one of them.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <Reveal className="zoom-media rounded-3xl">
            <img src={showroom} alt="J1 Auto Trade showroom" loading="lazy" width={1600} height={1000} className="rounded-3xl object-cover shadow-float" />
          </Reveal>
          <Reveal delay={100} className="space-y-10">
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">Our mission</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To make buying a premium car feel effortless and transparent — no pressure, no
                hidden fees, no surprises on collection day.
              </p>
            </div>
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <Building2 className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">Our vision</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To be the UK's most trusted independent for luxury and performance cars, with a
                collection curated as carefully as a private garage.
              </p>
            </div>
            <div>
              <span className="grid h-11 w-11 place-items-center rounded-xl accent-gradient text-accent-foreground">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold">How we work</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Every car is bought by our own buyers, inspected across 165 points and prepared
                in-house before it ever reaches the showroom floor.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="shell grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [<Counter key="a" to={16} />, "Years trading"],
            [<Counter key="b" to={108} suffix="+" />, "Cars in stock"],
            [<Counter key="c" to={10000} suffix="+" />, "Cars delivered"],
            [<Counter key="d" to={38} />, "Specialists on site"],
          ].map(([value, label], i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="glass-dark p-8 text-center">
                <p className="font-display text-4xl font-bold text-accent">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-ink-muted">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Achievements</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Recognised for the work</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Independent Dealer of the Year", "North West Motor Awards, 2024"],
              ["Top 50 UK Used Car Retailer", "Auto Retail Network, 2023 & 2025"],
              ["4.9/5 across 2,400 reviews", "Verified customer feedback"],
            ].map(([t, c], i) => (
              <Reveal key={t} delay={i * 60} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">The team</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Meet the people</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(([name, role], i) => (
              <Reveal key={name} delay={i * 60}>
                <div className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full accent-gradient font-display text-xl font-bold text-accent-foreground">
                    {name?.charAt(0)}
                  </span>
                  <h3 className="mt-5 font-semibold">{name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{role}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="accent">
              <Link to="/stocklist" search={stockSearch()}>See what we have in stock</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
