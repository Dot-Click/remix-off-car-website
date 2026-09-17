import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StorageImage } from "@/components/admin/StorageImage";
import { Button } from "@/components/ui/button";
import { gbp, listVehicles, miles, shortDate } from "@/lib/vehicle-admin";

export const Route = createFileRoute("/admin/_authed/vehicles/sold")({
  head: () => ({
    meta: [
      { title: "Sold Vehicles | J1 Autoland CMS" },
      { name: "description", content: "Archive of vehicles marked as sold in the J1 Autoland inventory." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Sold Vehicles | J1 Autoland CMS" },
      { property: "og:description", content: "Archive of sold vehicles." },
    ],
  }),
  component: SoldVehicles,
});

function SoldVehicles() {
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-vehicles"], queryFn: listVehicles });
  const sold = data.filter((v) => v.status === "Sold");

  return (
    <AdminShell
      title="Sold vehicles"
      description="Vehicles marked as Sold. Change a status back to Available to relist it."
      breadcrumbs={[{ label: "Vehicles", to: "/admin/vehicles" }, { label: "Sold" }]}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading vehicles…
        </div>
      ) : sold.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sold vehicles yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-4">Vehicle</th>
                <th className="px-4 py-4">Year</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Mileage</th>
                <th className="px-4 py-4">Added</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sold.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <StorageImage
                        path={v.main_image}
                        alt={`${v.make} ${v.model}`}
                        className="h-12 w-20 shrink-0 rounded-lg border border-border"
                      />
                      <div>
                        <p className="font-semibold">{v.make}</p>
                        <p className="text-xs text-muted-foreground">{v.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{v.year}</td>
                  <td className="px-4 py-3 font-semibold">{gbp(Number(v.price))}</td>
                  <td className="px-4 py-3">{miles(v.mileage)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shortDate(v.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/admin/vehicles/$id/edit" params={{ id: v.id }}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
