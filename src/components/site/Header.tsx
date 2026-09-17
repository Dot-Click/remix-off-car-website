import { useEffect, useState } from "react";
import { stockSearch } from "@/lib/stock-search";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/Logo";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/lib/cms";
import { useBusiness, useHeaderSettings, useNavItems } from "@/lib/site-content";

const NAV = [
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

const STOCK_MENU = [
  { label: "All Vehicles", body: "" },
  { label: "SUV", body: "SUV" },
  { label: "Sedan", body: "Sedan" },
  { label: "Coupe", body: "Coupe" },
  { label: "Hatchback", body: "Hatchback" },
  { label: "Electric", body: "Electric" },
  { label: "Hybrid", body: "Hybrid" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // CMS-managed content (falls back to the original values when empty).
  const business = useBusiness();
  const header = useHeaderSettings();
  const cmsNav = useNavItems("header");
  const nav: { to: string; label: string }[] = cmsNav.length
    ? cmsNav.map((n) => ({ to: n.url, label: n.label }))
    : NAV.map((n) => ({ to: n.to, label: n.label }));

  const { data: categories } = useQuery({
    queryKey: ["cms", "categories", "body_type"],
    queryFn: () => listCategories("body_type"),
    staleTime: 60_000,
  });
  const stockMenu = categories?.length
    ? [
        { label: "All Vehicles", body: "" },
        ...categories.filter((c) => c.enabled).map((c) => ({ label: c.name, body: c.name })),
      ]
    : STOCK_MENU.map((s) => ({ label: s.label, body: s.body as string }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-ink-border bg-[oklch(0.13_0_0/0.88)] shadow-float backdrop-blur-xl"
          : "bg-gradient-to-b from-black/50 to-transparent",
      )}
    >
      <div
        className={cn(
          "shell flex items-center justify-between gap-8 transition-all duration-500",
          scrolled ? "h-[86px]" : "h-[104px]",
        )}
      >
        <Logo tone="light" size="lg" variant="default" className="px-4 py-2" />

        <nav className="hidden items-center gap-7 xl:flex">
          {nav.map((item) =>
            item.to === "/stocklist" ? (
              <div key={item.to} className="group relative">
                <Link
                  to={item.to as "/stocklist"}
                  search={stockSearch()}
                  activeProps={{ className: "text-accent" }}
                  className="link-underline flex items-center gap-1 text-[13px] font-medium tracking-wide text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-52 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-ink-border bg-[oklch(0.13_0_0/0.96)] p-2 shadow-float backdrop-blur-xl">
                    {stockMenu.map((s) => (
                      <Link
                        key={s.label}
                        to="/stocklist"
                        search={stockSearch(s.body ? { body: s.body } : {})}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium text-ink-foreground/80 transition-colors hover:bg-white/5 hover:text-accent"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to as "/"}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="link-underline text-[13px] font-medium tracking-wide text-ink-foreground/80 transition-colors hover:text-ink-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          {header.show_phone && (
          <a
            href={business.phone_href}
            className="hidden items-center gap-2 rounded-full border border-ink-border px-3.5 py-2 text-[13px] font-medium text-ink-foreground/80 transition-colors hover:border-accent hover:text-ink-foreground lg:flex"
          >
            <Phone className="h-4 w-4 text-accent" />
            {business.phone}
          </a>
          )}

          <Button asChild variant="accent" className="hidden sm:inline-flex">
            <Link to={header.cta_url as "/stocklist"} search={stockSearch()}>
              {header.cta_label}
            </Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-border text-ink-foreground xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-104px)] overflow-y-auto border-t border-ink-border bg-[oklch(0.13_0_0/0.96)] backdrop-blur-xl xl:hidden">
          <nav className="shell grid gap-1 py-5">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to as "/"}
                {...(item.to === "/stocklist" ? { search: stockSearch() } : {})}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-foreground/85 transition-colors hover:bg-white/5 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2 sm:hidden">
              <Button asChild variant="accent" className="h-11 w-full">
                <Link to={header.cta_url as "/stocklist"} search={stockSearch()} onClick={() => setOpen(false)}>
                  {header.cta_label}
                </Link>
              </Button>
              <a
                href={business.phone_href}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-ink-border text-sm font-medium text-ink-foreground"
              >
                <Phone className="h-4 w-4 text-accent" /> {business.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
