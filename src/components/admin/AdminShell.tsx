import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Car,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  Image,
  ListTree,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  PanelsTopLeft,
  Settings,
  Star,
  Tags,
  UserCog,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLink = { to: string; label: string; icon: typeof Gauge; exact?: boolean };
type NavGroup = { title: string; links: NavLink[] };

const GROUPS: NavGroup[] = [
  {
    title: "Overview",
    links: [{ to: "/admin", label: "Dashboard", icon: Gauge, exact: true }],
  },
  {
    title: "Website",
    links: [
      { to: "/admin/website", label: "All Pages", icon: FileText, exact: true },
      { to: "/admin/website/home", label: "Homepage", icon: FileText },
      { to: "/admin/website/about-us", label: "About Us", icon: FileText },
      { to: "/admin/website/services", label: "Services", icon: FileText },
      { to: "/admin/website/finance", label: "Finance", icon: FileText },
      { to: "/admin/website/contact", label: "Contact", icon: FileText },
      { to: "/admin/website/stocklist", label: "Stocklist", icon: FileText },
      { to: "/admin/website/valuation", label: "Valuation", icon: FileText },
      { to: "/admin/website/warranty", label: "Warranty", icon: FileText },
      { to: "/admin/website/reviews", label: "Reviews", icon: FileText },
      { to: "/admin/website/find-us", label: "Find Us", icon: FileText },
      { to: "/admin/website/faq", label: "FAQ", icon: FileText },
      { to: "/admin/website/sell-your-car", label: "Sell Your Car", icon: FileText },
      { to: "/admin/website/part-exchange", label: "Part Exchange", icon: FileText },
      { to: "/admin/navigation", label: "Navigation / Menu", icon: ListTree },
    ],
  },

  {
    title: "Vehicles",
    links: [
      { to: "/admin/vehicles", label: "All Vehicles", icon: Car, exact: true },
      { to: "/admin/vehicles/new", label: "Add New Vehicle", icon: Car },
      { to: "/admin/vehicles/categories", label: "Vehicle Categories", icon: Tags },
      { to: "/admin/vehicles/sold", label: "Sold Vehicles", icon: Star },
    ],
  },
  {
    title: "Content",
    links: [
      { to: "/admin/media", label: "Media Library", icon: Image },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    title: "Customers",
    links: [
      { to: "/admin/enquiries", label: "Enquiries", icon: Mail },
      { to: "/admin/orders", label: "Payments / Orders", icon: CreditCard },
    ],
  },
  {
    title: "Configuration",
    links: [
      { to: "/admin/global", label: "Header & Footer", icon: PanelsTopLeft },
      { to: "/admin/settings", label: "Website Settings", icon: Settings },
      { to: "/admin/profile", label: "Admin Profile", icon: UserCog },
    ],
  },
];

export function AdminShell({
  title,
  description,
  breadcrumbs = [],
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", search: { denied: false }, replace: true });
  };

  const isActive = (link: NavLink) =>
    link.exact ? pathname === link.to : pathname.startsWith(link.to);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground">
          J1
        </span>
        <span className="text-sm font-semibold tracking-wide">Autoland CMS</span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive(link)
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOut /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute right-3 top-4 text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <nav className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">
              Dashboard
            </Link>
            {breadcrumbs.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5 truncate">
                <ChevronRight className="h-3 w-3" />
                {b.to ? (
                  <Link to={b.to} className="hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="truncate text-foreground">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
          <div className="ml-auto">
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                View site
              </a>
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
                {description && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
            <div className="mt-7">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
