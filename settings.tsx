import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSetting, saveSetting, type BusinessSettings } from "@/lib/cms";
import { BUSINESS_FALLBACK } from "@/lib/site-content";

export const Route = createFileRoute("/admin/_authed/settings")({
  head: () => ({
    meta: [
      { title: "Website Settings | J1 Autoland CMS" },
      { name: "description", content: "Edit business name, contact details, opening hours and social links." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Website Settings | J1 Autoland CMS" },
      { property: "og:description", content: "Edit business and contact information." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cms", "settings", "business"],
    queryFn: () => getSetting<BusinessSettings>("business"),
  });

  const [form, setForm] = useState<BusinessSettings>(BUSINESS_FALLBACK);

  useEffect(() => {
    if (data) setForm({
      ...BUSINESS_FALLBACK,
      ...data,
      social: { ...BUSINESS_FALLBACK.social, ...(data.social ?? {}) },
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => {
      const tiktok = form.social.tiktok.trim();
      if (tiktok) {
        try {
          const url = new URL(tiktok);
          if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
        } catch {
          throw new Error("Enter a complete TikTok URL starting with https://, or leave it blank.");
        }
      }
      return saveSetting("business", { ...form, social: { ...form.social, tiktok } });
    },
    onSuccess: () => {
      toast.success("Business information saved");
      queryClient.invalidateQueries({ queryKey: ["cms", "settings", "business"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <AdminShell
      title="Website settings"
      description="These details are used in the header, footer, contact page and find-us page."
      breadcrumbs={[{ label: "Website Settings" }]}
      actions={
        <Button variant="accent" disabled={save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save settings
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
        </div>
      ) : (
        <div className="space-y-6">
          <Card title="Business information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Business name" value={form.name} onChange={(v) => set("name", v)} />
              <Text label="Display name" value={form.name_title} onChange={(v) => set("name_title", v)} />
              <Text label="Legal entity" value={form.legal} onChange={(v) => set("legal", v)} />
              <Text label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
            </div>
          </Card>

          <Card title="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Phone (displayed)" value={form.phone} onChange={(v) => set("phone", v)} />
              <Text label="Phone link (tel:)" value={form.phone_href} onChange={(v) => set("phone_href", v)} />
              <Text label="WhatsApp URL" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
              <Text label="Email" value={form.email} onChange={(v) => set("email", v)} />
              <Text label="Address" value={form.address} onChange={(v) => set("address", v)} />
              <Text label="Website" value={form.website} onChange={(v) => set("website", v)} />
            </div>
          </Card>

          <Card title="Opening hours">
            <div className="space-y-3">
              {form.hours.map((row, i) => (
                <div key={i} className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[180px] flex-1">
                    <Text
                      label="Days"
                      value={row.day}
                      onChange={(v) =>
                        set(
                          "hours",
                          form.hours.map((h, idx) => (idx === i ? { ...h, day: v } : h)),
                        )
                      }
                    />
                  </div>
                  <div className="min-w-[180px] flex-1">
                    <Text
                      label="Hours"
                      value={row.time}
                      onChange={(v) =>
                        set(
                          "hours",
                          form.hours.map((h, idx) => (idx === i ? { ...h, time: v } : h)),
                        )
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => set("hours", form.hours.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => set("hours", [...form.hours, { day: "", time: "" }])}
              >
                <Plus /> Add row
              </Button>
            </div>
          </Card>

          <Card title="Social links">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text
                label="Instagram"
                value={form.social.instagram}
                onChange={(v) => set("social", { ...form.social, instagram: v })}
              />
              <Text
                label="Facebook"
                value={form.social.facebook}
                onChange={(v) => set("social", { ...form.social, facebook: v })}
              />
              <Text
                label="YouTube"
                value={form.social.youtube}
                onChange={(v) => set("social", { ...form.social, youtube: v })}
              />
              <Text
                label="TikTok URL (leave blank to hide)"
                value={form.social.tiktok}
                onChange={(v) => set("social", { ...form.social, tiktok: v })}
              />
              <Text
                label="LinkedIn"
                value={form.social.linkedin}
                onChange={(v) => set("social", { ...form.social, linkedin: v })}
              />
            </div>
          </Card>
        </div>
      )}
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
