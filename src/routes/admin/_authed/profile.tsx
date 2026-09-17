import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/_authed/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile | J1 Autoland CMS" },
      { name: "description", content: "Update the administrator email address and password." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Profile | J1 Autoland CMS" },
      { property: "og:description", content: "Update administrator account details." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { adminEmail } = Route.useRouteContext();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("");

  const saveEmail = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Confirmation email sent to the new address"),
    onError: (e: Error) => toast.error(e.message),
  });

  const savePassword = useMutation({
    mutationFn: async () => {
      if (password.length < 8) throw new Error("Use at least 8 characters.");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Password updated");
      setPassword("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Admin profile"
      description="Manage the credentials used to sign in to this dashboard."
      breadcrumbs={[{ label: "Admin Profile" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Email address</h2>
          <div className="mt-4">
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button
            className="mt-4"
            size="sm"
            variant="outline"
            disabled={saveEmail.isPending || email === adminEmail}
            onClick={() => saveEmail.mutate()}
          >
            {saveEmail.isPending ? <Loader2 className="animate-spin" /> : <Save />} Update email
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Password</h2>
          <div className="mt-4">
            <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              New password
            </Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button
            className="mt-4"
            size="sm"
            variant="accent"
            disabled={savePassword.isPending || !password}
            onClick={() => savePassword.mutate()}
          >
            {savePassword.isPending ? <Loader2 className="animate-spin" /> : <Save />} Update password
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}
