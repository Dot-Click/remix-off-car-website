import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/lib/vehicle-admin";
import { mapRowToVehicle, type VehicleRow } from "@/lib/vehicle-map";
import { VEHICLES, type Vehicle } from "@/data/vehicles";

export type { VehicleRow };

/** Map a database row into the public Vehicle shape, resolving storage images. */
export async function mapVehicleRow(row: VehicleRow): Promise<Vehicle> {
  const main = await resolveImageUrl(row.main_image);
  const gallery = (
    await Promise.all((row.gallery_images ?? []).map((p) => resolveImageUrl(p)))
  ).filter((u): u is string => !!u);
  return mapRowToVehicle(row, main, gallery);
}

async function fetchPublicVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(mapVehicleRow));
}

/** Published vehicles created in the admin dashboard (public.vehicles), newest first. */
export function usePublicVehicles() {
  return useQuery({
    queryKey: ["public-vehicles"],
    queryFn: fetchPublicVehicles,
    staleTime: 30_000,
  });
}

/**
 * The full public catalogue: admin-managed vehicles first, then the original
 * demo/static catalogue. Both are kept — CMS vehicles are added, never a
 * replacement.
 */
export function useCatalogue(): Vehicle[] {
  const { data } = usePublicVehicles();
  return useMemo(() => {
    const live = data ?? [];
    const liveIds = new Set(live.map((v) => v.id));
    return [...live, ...VEHICLES.filter((v) => !liveIds.has(v.id))];
  }, [data]);
}

/** Featured vehicles (admin-featured first, then demo featured), excluding sold. */
export function useFeaturedVehicles(limit = 6) {
  const catalogue = useCatalogue();
  return {
    data: catalogue.filter((v) => v.featured && v.status !== "Sold").slice(0, limit),
  };
}

/** Newest arrivals across both sources, excluding sold. */
export function useLatestVehicles(limit = 4) {
  const { data } = usePublicVehicles();
  const live = (data ?? []).filter((v) => v.status !== "Sold");
  const demo = [...VEHICLES]
    .filter((v) => v.status !== "Sold")
    .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
  return { data: [...live, ...demo].slice(0, limit) };
}
