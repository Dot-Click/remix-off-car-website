import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

/**
 * Public read of a single published vehicle (anon policy: published = true).
 *
 * Uses the generated Supabase client, which resolves its config from the
 * build-time inlined VITE_SUPABASE_* values and only falls back to
 * process.env. Hand-rolled clients that read process.env['SUPABASE_URL']
 * only worked in the Lovable preview and threw in production hosts where
 * that non-VITE variable is not defined.
 */
export const getPublicVehicleRow = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", data.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;

    const sign = async (path: string): Promise<string | null> => {
      if (path.startsWith("http")) return path;
      const { data: signed } = await supabase.storage
        .from("vehicle-images")
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      return signed?.signedUrl ?? null;
    };

    const image = row.main_image ? await sign(row.main_image) : null;

    const gallery: string[] = [];
    for (const path of row.gallery_images ?? []) {
      if (!path) continue;
      const url = await sign(path);
      if (url) gallery.push(url);
    }

    return { row, image, gallery };
  });
