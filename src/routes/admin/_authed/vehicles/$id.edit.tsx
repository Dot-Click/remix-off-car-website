import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { getVehicleById } from "@/lib/vehicle-admin";

export const Route = createFileRoute("/admin/_authed/vehicles/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Vehicle | J1 Autoland Admin" },
      { name: "description", content: "Edit an existing vehicle in the J1 Autoland inventory." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Edit Vehicle | J1 Autoland Admin" },
      { property: "og:description", content: "Edit an existing vehicle in the J1 Autoland inventory." },
    ],
  }),
  component: EditVehicle,
});

function EditVehicle() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-vehicle", id],
    queryFn: () => getVehicleById(id),
  });

  return (
    <AdminShell
      title={data ? `${data.year} ${data.make} ${data.model}` : "Edit vehicle"}
      description="Update specifications, pricing, status, featured flag and images."
      breadcrumbs={[{ label: "Vehicles", to: "/admin/vehicles" }, { label: "Edit" }]}
    >
      {isLoading && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading vehicle…
        </div>
      )}
      {error && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(error as Error).message}
        </p>
      )}
      {data && <VehicleForm vehicle={data} />}
    </AdminShell>
  );
}
