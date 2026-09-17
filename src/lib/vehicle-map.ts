import type { Tables } from "@/integrations/supabase/types";
import type { Vehicle } from "@/data/vehicles";
import fallbackImage from "@/assets/car-sedan.jpg";

export type VehicleRow = Tables<"vehicles">;

/**
 * Map a public.vehicles row (plus already-resolved image URLs) into the shape
 * the existing public VehicleCard / detail page components expect.
 */
export function mapRowToVehicle(
  row: VehicleRow,
  image: string | null,
  gallery: string[] = [],
): Vehicle {
  const price = Number(row.price ?? 0);
  const main = image ?? fallbackImage;
  const extra = gallery.filter((g) => g && g !== main);

  return {
    id: row.id,
    make: row.make,
    model: row.model,
    variant: row.engine ?? row.fuel_type ?? "",
    year: row.year,
    price,
    monthly: Math.round(price * 0.0135 + 89),
    mileage: row.mileage ?? 0,
    transmission: row.transmission === "Manual" ? "Manual" : "Automatic",
    fuel: (row.fuel_type ?? "Petrol") as Vehicle["fuel"],
    bodyType: row.body_type ?? "Saloon",
    colour: row.exterior_color ?? "\u2014",
    driveType: "AWD",
    engine: row.engine ?? "\u2014",
    doors: 5,
    vin: "\u2014",
    registration: "\u2014",
    status: row.status,
    featured: row.featured,
    image: main,
    gallery: [main, ...extra],
    features: [],
    description: row.description ?? "",
    onlinePurchase: false,
    ...(row.interior_color ? { interiorColour: row.interior_color } : {}),
    addedDaysAgo: Math.max(
      0,
      Math.round((Date.now() - new Date(row.created_at).getTime()) / 86_400_000),
    ),
  };
}
