import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createNav, deleteNav, listNav, updateNav, type NavItem } from "@/lib/cms";

export const Route = createFileRoute("/admin/_authed/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation | J1 Autoland CMS" },
      { name: "description", content: "Add, rename, reorder and disable header and footer menu links." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Navigation | J1 Autoland CMS" },
      { property: "og:description", content: "Manage website menus." },
    ],
  }),
  component: NavigationAdmin,
});

const LOCATIONS: { key: string; title: string; hint: string }[] = [
  { key: "header", title: "Header menu", hint: "Main navigation shown in the sticky header." },
  { key: "footer", title: "Footer menu", hint: "Quick links column in the footer." },
  { key: "footer_secondary", title: "Footer secondary menu", hint: "Second footer links column." },
];

function NavigationAdmin() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "nav"], queryFn: () => listNav() });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "nav"] });
    queryClient.invalidateQueries({ queryKey: ["cms", "nav"] });
    LOCATIONS.forEach((l) => queryClient.invalidateQueries({ queryKey: ["cms", "nav", l.key] }));
  };

  const patch = useMutation({
    mutationFn: ({ id, patch: p }: { id: string; patch: Partial<NavItem> }) => updateNav(id, p),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: (location: string) =>
      createNav({
        location,
        label: "New link",
        url: "/",
        sort_order: data.filter((n) => n.location === location).length,
      }),
    onSuccess: () => {
      toast.success("Menu item added");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteNav(id),
    onSuccess: () => {
      toast.success("Menu item removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = (items: NavItem[], index: number, direction: -1 | 1) => {
    const target = items[index + direction];
    const current = items[index];
    if (!target || !current) return;
    patch.mutate({ id: current.id, patch: { sort_order: target.sort_order } });
    patch.mutate({ id: target.id, patch: { sort_order: current.sort_order } });
  };

  return (
    <AdminShell
      title="Navigation / menu"
      description="Menu labels, links, order and visibility. The navigation design is unchanged."
      breadcrumbs={[{ label: "Navigation" }]}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading menus…
        </div>
      ) : (
        <div className="space-y-6">
          {LOCATIONS.map((loc) => {
            const items = data
              .filter((n) => n.location === loc.key)
              .sort((a, b) => a.sort_order - b.sort_order);
            return (
              <div key={loc.key} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold">{loc.title}</h2>
                    <p className="text-xs text-muted-foreground">{loc.hint}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => add.mutate(loc.key)}>
                    <Plus /> Add item
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex flex-wrap items-center gap-2">
                      <Input
                        className="w-40"
                        defaultValue={item.label}
                        onBlur={(e) =>
                          e.target.value !== item.label &&
                          patch.mutate({ id: item.id, patch: { label: e.target.value } })
                        }
                      />
                      <Input
                        className="w-56"
                        defaultValue={item.url}
                        onBlur={(e) =>
                          e.target.value !== item.url &&
                          patch.mutate({ id: item.id, patch: { url: e.target.value } })
                        }
                      />
                      <Input
                        className="w-40"
                        placeholder="Group (optional)"
                        defaultValue={item.group_label ?? ""}
                        onBlur={(e) =>
                          e.target.value !== (item.group_label ?? "") &&
                          patch.mutate({ id: item.id, patch: { group_label: e.target.value || null } })
                        }
                      />
                      <div className="flex items-center gap-1.5">
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={(on) => patch.mutate({ id: item.id, patch: { enabled: on } })}
                        />
                        <span className="text-xs text-muted-foreground">Visible</span>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={index === 0}
                          onClick={() => move(items, index, -1)}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={index === items.length - 1}
                          onClick={() => move(items, index, 1)}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove.mutate(item.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-muted-foreground">No items in this menu yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
