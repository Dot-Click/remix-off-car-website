import { createFileRoute, Link } from "@tanstack/react-router";
import { stockSearch } from "@/lib/stock-search";
import { Play, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import heroReviews from "@/assets/hero-reviews.jpg";
import {
  field,
  usePageSections,
  usePublishedTestimonials,
  useMediaUrl,
} from "@/lib/site-content";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — 4.9/5 | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Read verified reviews from J1 Auto Trade customers. Rated 4.9 out of 5 from more than 2,400 buyers across the UK.",
      },
      { property: "og:title", content: "Customer Reviews — 4.9/5 | J1 Auto Trade" },
      { property: "og:description", content: "Verified reviews from more than 2,400 J1 Auto Trade buyers." },
    ],
  }),
  component: Reviews,
});

const REVIEWS_FALLBACK = [
  { customer_name: "Daniel Whitmore", vehicle: "Range Rover Sport", rating: 5, review: "Flawless from first enquiry to delivery. The car was better than described and the finance took ten minutes." },
  { customer_name: "Priya Raman", vehicle: "Audi e-tron GT", rating: 5, review: "Fifteen years of main dealers and nothing came close. No pressure, total transparency." },
  { customer_name: "Marcus Bell", vehicle: "BMW M4 Competition", rating: 5, review: "Fair part exchange price and I was in the M4 the same weekend." },
  { customer_name: "Sophie Lang", vehicle: "Tesla Model Y", rating: 5, review: "It arrived immaculate, fully charged and with a full history pack." },
  { customer_name: "Owen Pritchard", vehicle: "Mercedes GLE 400d", rating: 5, review: "They found a spec that wasn't even in stock and sourced it within a fortnight." },
  { customer_name: "Amelia Cross", vehicle: "VW Golf R", rating: 4, review: "Great car and great service. Only note is delivery slipped by a day." },
  { customer_name: "Tunde Adeyemi", vehicle: "Land Rover Defender 110", rating: 5, review: "The prep work is on another level. It genuinely felt like a new car." },
  { customer_name: "Kirsty Doyle", vehicle: "Honda Civic Type R", rating: 5, review: "First performance car and they talked me through every option without upselling." },
  { customer_name: "Ravi Shah", vehicle: "Tesla Model S Plaid", rating: 5, review: "Handled my finance settlement with my old lender directly. Zero stress." },
] as const;

const BREAKDOWN = [
  [5, 88],
  [4, 9],
  [3, 2],
  [2, 1],
  [1, 0],
];

function Reviews() {
  const sections = usePageSections("reviews");
  const hero = sections["hero"];
  const introS = sections["intro"];
  const ctaS = sections["cta"];

  const heroImage = useMediaUrl(hero?.background_image_path ?? null, heroReviews);

  const cmsReviews = usePublishedTestimonials();
  const reviews = cmsReviews.length
    ? cmsReviews.map((t) => ({ customer_name: t.customer_name, vehicle: t.vehicle ?? "", rating: t.rating ?? 5, review: t.review }))
    : REVIEWS_FALLBACK;

  return (
    <>
      <PageHero
        image={heroImage}
        crumb="Reviews"
        label={field(hero, "eyebrow", "Trusted By Our Customers")}
        title={field(hero, "heading", "What Our Customers Say")}
        description={field(
          hero,
          "description",
          "Real customers. Real experiences. 4.9 out of 5 from 2,417 verified buyers across Google, Autotrader and our own aftercare surveys.",
        )}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-border bg-white/5 px-4 py-2 text-sm font-semibold text-ink-foreground">
          5.0
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </span>
        </span>
      </PageHero>

      <section className="py-20">
        <div className="shell grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Reveal className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <p className="font-display text-6xl font-bold">4.9</p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Based on 2,417 reviews</p>
              <div className="mt-7 space-y-3">
                {BREAKDOWN.map(([stars, pct]) => (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-8 shrink-0 text-muted-foreground">{stars}★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span className="block h-full accent-gradient" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-9 shrink-0 text-right text-muted-foreground">{pct}%</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="accent" className="mt-8 w-full">
                <Link to="/stocklist" search={stockSearch()}>Browse stock</Link>
              </Button>
            </div>
          </Reveal>

          <div>
            <h2 className="font-display text-2xl font-semibold">Video testimonials</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {["Elliot & the Defender", "Marta's first EV", "The Okonkwo family"].map((t, i) => (
                <Reveal key={t} delay={i * 60}>
                  <button className="group w-full overflow-hidden rounded-2xl surface-ink p-8 text-left transition-transform duration-500 hover:-translate-y-1">
                    <span className="grid h-12 w-12 place-items-center rounded-full accent-gradient text-accent-foreground transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5" />
                    </span>
                    <span className="mt-5 block font-semibold text-ink-foreground">{t}</span>
                    <span className="mt-1 block text-xs text-ink-muted">2 min watch</span>
                  </button>
                </Reveal>
              ))}
            </div>

            <h2 className="mt-14 font-display text-2xl font-semibold">Customer stories</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {reviews.map((r, i) => (
                <Reveal key={r.customer_name + i} delay={(i % 4) * 60} className="h-full">
                  <figure className="flex h-full min-h-[264px] flex-col rounded-2xl border border-border bg-card p-7 shadow-soft">
                    <div className="flex items-center justify-between">
                      <Quote className="h-6 w-6 text-accent" />
                      <span className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, s) => (
                          <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </span>
                    </div>
                    <blockquote className="mt-4 text-sm leading-relaxed">{r.review}</blockquote>
                    <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full accent-gradient text-sm font-semibold text-accent-foreground">
                        {r.customer_name.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{r.customer_name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          Verified buyer · {r.vehicle}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal>
            <p className="eyebrow">{field(introS, "eyebrow", "Real Customers. Real Experiences.")}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-foreground sm:text-4xl">
              {field(introS, "heading", "Every review is left by a verified buyer")}
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted">
              {field(
                introS,
                "description",
                "We never filter, edit or remove feedback. Our Google profile is updated live with each new handover, so what you read is exactly what our customers wrote.",
              )}
            </p>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl border border-ink-border bg-white/5 p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-ink-muted">Google Reviews</p>
            <p className="mt-3 font-display text-5xl font-bold text-ink-foreground">4.9</p>
            <div className="mt-3 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-muted">Live Google rating feed connects here</p>
            <Button asChild variant="accent" className="mt-6 w-full">
              <Link to="/stocklist" search={stockSearch()}>{field(ctaS, "button_text", "Find Your Next Car")}</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
