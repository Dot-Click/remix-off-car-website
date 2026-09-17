import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Star,
  Tag,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StorageImage } from "@/components/admin/StorageImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gbp, listVehicles, shortDate } from "@/lib/vehicle-admin";
import { listEnquiries } from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/")({
  head: () => ({
    meta: [
      { title: "Dashboard | J1 Autoland CMS" },
      { name: "description", content: "Internal J1 Autoland dashboard for managing website content and vehicle inventory." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Dashboard | J1 Autoland CMS" },
      { property: "og:description", content: "Internal J1 Autoland content and inventory dashboard." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { adminEmail } = Route.useRouteContext();

  const vehicles = useQuery({ queryKey: ["admin-vehicles"], queryFn: listVehicles });
  const enquiries = useQuery({ queryKey: ["admin", "enquiries"], queryFn: listEnquiries });

  const list = vehicles.data ?? [];
  const stats = [
    { label: "Total vehicles", value: list.length, icon: Car },
    { label: "Available", value: list.filter((v) => v.status === "Available").length, icon: CheckCircle2 },
    { label: "Reserved", value: list.filter((v) => v.status === "Reserved").length, icon: Clock },
    { label: "Sold", value: list.filter((v) => v.status === "Sold").length, icon: Tag },
    { label: "Featured", value: list.filter((v) => v.featured).length, icon: Star },
    { label: "Enquiries", value: enquiries.data?.length ?? 0, icon: Mail },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description={`Signed in as ${adminEmail}`}
      actions={
        <>
          <Button asChild variant="outline">
            <Link to="/admin/website">Edit website</Link>
          </Button>
          <Button asChild variant="accent">
            <Link to="/admin/vehicles/new">Add vehicle</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">
              {vehicles.isLoading || enquiries.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                s.value
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold">Recent vehicles</h2>
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin/vehicles">View all</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border/60">
            {list.slice(0, 5).map((v) => (
              <li key={v.id} className="flex items-center gap-3 px-5 py-3">
                <StorageImage
                  path={v.main_image}
                  alt={`${v.make} ${v.model}`}
                  className="h-11 w-16 shrink-0 rounded-lg border border-border"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {v.year} {v.make} {v.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {gbp(Number(v.price))} · {shortDate(v.created_at)}
                  </p>
                </div>
                <Badge variant={v.status === "Available" ? "default" : "outline"}>{v.status}</Badge>
              </li>
            ))}
            {!vehicles.isLoading && list.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                No vehicles yet.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold">Recent enquiries</h2>
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin/enquiries">View all</Link>
            </Button>
          </div>
          <ul className="divide-y divide-border/60">
            {(enquiries.data ?? []).slice(0, 5).map((e) => (
              <li key={e.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold">{e.name}</p>
                  <Badge variant={e.status === "new" ? "default" : "outline"}>{e.status}</Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {e.email} · {shortDate(e.created_at)}
                </p>
              </li>
            ))}
            {!enquiries.isLoading && (enquiries.data?.length ?? 0) === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                No enquiries yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
