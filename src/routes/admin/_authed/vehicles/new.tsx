import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const Route = createFileRoute("/admin/_authed/vehicles/new")({
  head: () => ({
    meta: [
      { title: "Add Vehicle | J1 Autoland Admin" },
      { name: "description", content: "Add a new vehicle to the J1 Autoland inventory." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Add Vehicle | J1 Autoland Admin" },
      { property: "og:description", content: "Add a new vehicle to the J1 Autoland inventory." },
    ],
  }),
  component: NewVehicle,
});

function NewVehicle() {
  return (
    <AdminShell
      title="Add new vehicle"
      description="Create a new vehicle listing with specifications, images and status."
      breadcrumbs={[{ label: "Vehicles", to: "/admin/vehicles" }, { label: "Add new" }]}
    >
      <VehicleForm />
    </AdminShell>
  );
}
