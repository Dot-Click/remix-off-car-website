import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { LogoMark } from "@/components/site/Logo";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/business-card")({
  head: () => ({
    meta: [
      { title: "Business Card Concept | J1 Auto Trade" },
      {
        name: "description",
        content:
          "Premium J1 Auto Trade business card concept — front and back layouts matching the dealership brand identity.",
      },
      { property: "og:title", content: "J1 Auto Trade Business Card Concept" },
      {
        property: "og:description",
        content: "Front and back business card design matching the J1 Auto Trade brand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusinessCard,
});

function BusinessCard() {
  return (
    <main className="pt-32 pb-24">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Brand Identity</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Business Card Concept
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A premium 85 × 55 mm card concept using the same {BRAND.name} identity as the website —
            charcoal base, accent detail and the J1 automotive monogram.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* FRONT */}
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Front
            </p>
            <div className="relative aspect-[85/55] overflow-hidden rounded-2xl bg-primary shadow-float">
              <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-2xl" />
              <span className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-accent" />
              <div className="relative flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
                <LogoMark className="h-14 w-14 rounded-2xl ring-white/20" />
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-primary-foreground">
                    J1<span className="text-accent">.</span>
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.42em] text-primary-foreground/70">
                    {BRAND.suffix}
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground/50">
                  {BRAND.tagline}
                </p>
              </div>
            </div>
          </Reveal>

          {/* BACK */}
          <Reveal delay={100}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Back
            </p>
            <div className="relative aspect-[85/55] overflow-hidden rounded-2xl border border-border bg-card shadow-float">
              <span className="absolute right-0 top-0 h-full w-1.5 bg-accent" />
              <div className="flex h-full flex-col justify-between p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold">James Whitaker</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Sales Director
                    </p>
                  </div>
                  <LogoMark className="h-10 w-10" />
                </div>
                <ul className="grid gap-2 text-[12px] text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-accent" /> {BRAND.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-accent" /> {BRAND.email}
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-accent" /> {BRAND.website}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" /> {BRAND.address}
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
