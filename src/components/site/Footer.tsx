import { Link } from "@tanstack/react-router";
import { useState, type ElementType } from "react";
import { Facebook, Instagram, Youtube, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Logo } from "@/components/site/Logo";
import { BRAND } from "@/lib/brand";
import { stockSearch } from "@/lib/stock-search";
import { useBusiness, useFooterSettings, useNavItems } from "@/lib/site-content";




const QUICK = [
  { to: "/", label: "Home" },
  { to: "/stocklist", label: "Stocklist" },
  { to: "/services", label: "Services" },
  { to: "/valuation", label: "Valuation" },
  { to: "/warranty", label: "Warranty" },
  { to: "/finance", label: "Finance" },
  { to: "/about-us", label: "About Us" },
  { to: "/reviews", label: "Reviews" },
  { to: "/find-us", label: "Find Us" },
] as const;

const VEHICLE_LINKS = [
  { label: "All Vehicles", search: { sort: "newest" } },
  { label: "Featured Vehicles", search: { sort: "price-desc" } },
  { label: "Latest Arrivals", search: { sort: "newest" } },
] as const;

const HOURS = [
  ["Monday – Friday", "09:00 – 18:30"],
  ["Saturday", "09:00 – 17:00"],
  ["Sunday", "11:00 – 16:00"],
  ["Bank Holidays", "By appointment"],
];

export function Footer() {
  const [email, setEmail] = useState("");

  // CMS-managed content (falls back to the original values when empty).
  const business = useBusiness();
  const footer = useFooterSettings();
  const cmsQuick = useNavItems("footer");
  const quick: { to: string; label: string }[] = cmsQuick.length
    ? cmsQuick.map((n) => ({ to: n.url, label: n.label }))
    : QUICK.map((q) => ({ to: q.to, label: q.label }));
  const hours = business.hours.length
    ? business.hours.map((h) => [h.day, h.time] as const)
    : HOURS.map((h) => [h[0] as string, h[1] as string] as const);
  const socials: [React.ElementType, string][] = [
    [Instagram, business.social.instagram],
    [Facebook, "https://www.facebook.com/share/1cXx52Thn4/?mibextid=wwXIfr"],
    [Youtube, business.social.youtube],
    [Linkedin, business.social.linkedin],
  ];

  return (
    <footer className="surface-ink">
      <div className="shell grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" size="lg" variant="default" className="mb-2" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
            {footer.description}
          </p>


          <form
            className="mt-7 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
                toast.error("Please enter a valid email address");
                return;
              }
              toast.success("You're subscribed to new arrivals");
              setEmail("");
            }}
          >
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 255))}
              type="email"
              placeholder={footer.newsletter_placeholder}
              aria-label="Email address"
              className="border-ink-border bg-white/5 text-ink-foreground placeholder:text-ink-muted"
            />
            <Button type="submit" variant="accent">
              {footer.newsletter_button}
            </Button>
          </form>

          <div className="mt-7 flex gap-2">
            {socials.map(([Icon, href], i) => (
              <a
                key={i}
                href={href || "#"}
                aria-label="Social profile"
                className="grid h-10 w-10 place-items-center rounded-lg border border-ink-border text-ink-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-foreground">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {quick.map((q) => (
              <li key={q.to}>
                <Link
                  to={q.to as "/"}
                  {...(q.to === "/stocklist" ? { search: stockSearch() } : {})}
                  className="text-ink-muted transition-colors hover:text-accent"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-foreground">
            Vehicles
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {VEHICLE_LINKS.map((v) => (
              <li key={v.label}>
                <Link
                  to="/stocklist"
                  search={stockSearch(v.search)}
                  className="text-ink-muted transition-colors hover:text-accent"
                >
                  {v.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/business-card" className="text-ink-muted transition-colors hover:text-accent">
                Business Card
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-foreground">
            Visit Us
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-ink-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {business.address}
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={business.phone_href}>{business.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </li>
            <li className="flex gap-3">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.929L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">
                {BRAND.phone}
              </a>
            </li>


            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="space-y-1">
                {hours.map(([d, h]) => (
                  <p key={d}>
                    <span className="text-ink-foreground">{d}</span> · {h}
                  </p>
                ))}
              </div>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-foreground">
            Find Us
          </h3>
          <div className="mt-5 overflow-hidden rounded-xl border border-ink-border">
            <iframe
              title={`${business.name} location map`}
              src="https://www.openstreetmap.org/export/embed.html?bbox=-2.35%2C53.44%2C-2.19%2C53.52&layer=mapnik"
              className="h-56 w-full grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.legal}. {footer.copyright}
          </p>
          <p>{footer.small_print}</p>
        </div>
      </div>
    </footer>
  );
}
