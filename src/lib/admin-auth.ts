import { supabase } from "@/integrations/supabase/client";

/** Returns the signed-in user only when they hold the admin role. */
export async function getAdminUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { user: null, isAdmin: false } as const;

  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: data.user.id,
    _role: "admin",
  });

  return { user: data.user, isAdmin: isAdmin === true } as const;
}
