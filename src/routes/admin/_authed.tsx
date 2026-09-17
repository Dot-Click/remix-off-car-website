import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminUser } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/_authed")({
  // Session lives in browser storage, so the gate must run client-side only.
  ssr: false,
  beforeLoad: async () => {
    const { user, isAdmin } = await getAdminUser();
    if (!user) {
      throw redirect({ to: "/admin/login", search: { denied: false } });
    }
    if (!isAdmin) {
      throw redirect({ to: "/admin/login", search: { denied: true } });
    }
    return { adminEmail: user.email ?? "" };
  },
  component: () => <Outlet />,
});
