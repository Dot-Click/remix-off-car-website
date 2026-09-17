import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEnquiry, listEnquiries, updateEnquiry, type Enquiry } from "@/lib/cms";
import { shortDate } from "@/lib/vehicle-admin";

export const Route = createFileRoute("/admin/_authed/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries | J1 Autoland CMS" },
      { name: "description", content: "Review and manage customer enquiries submitted through the website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Enquiries | J1 Autoland CMS" },
      { property: "og:description", content: "Review customer enquiries." },
    ],
  }),
  component: Enquiries,
});

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  read: "Read",
  contacted: "Contacted",
};

function Enquiries() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<string | null>(null);
  const [pending, setPending] = useState<Enquiry | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: listEnquiries,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });

  const patch = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEnquiry(id, { status }),
    onSuccess: () => {
      toast.success("Enquiry updated");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: () => {
      toast.success("Enquiry deleted");
      setPending(null);
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Enquiries"
      description="Messages submitted from the contact, valuation and vehicle enquiry forms."
      breadcrumbs={[{ label: "Enquiries" }]}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading enquiries…
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <ul className="divide-y divide-border/60">
            {data.map((e) => (
              <li key={e.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.email}
                      {e.phone ? ` · ${e.phone}` : ""} · {shortDate(e.created_at)}
                      {e.vehicle_label ? ` · ${e.vehicle_label}` : ""}
                    </p>
                  </div>
                  <Badge variant={e.status === "new" ? "default" : "outline"}>
                    {STATUS_LABEL[e.status] ?? e.status}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setOpen(open === e.id ? null : e.id)}>
                    {open === e.id ? "Hide" : "View"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPending(e)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>

                {open === e.id && (
                  <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                    {e.subject && <p className="text-sm font-medium">{e.subject}</p>}
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{e.message}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                      Source: {e.source}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={patch.isPending}
                        onClick={() => patch.mutate({ id: e.id, status: "read" })}
                      >
                        Mark as read
                      </Button>
                      <Button
                        size="sm"
                        variant="accent"
                        disabled={patch.isPending}
                        onClick={() => patch.mutate({ id: e.id, status: "contacted" })}
                      >
                        Mark as contacted
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              The message from {pending?.name} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(ev) => {
                ev.preventDefault();
                if (pending) remove.mutate(pending.id);
              }}
            >
              {remove.isPending ? <Loader2 className="animate-spin" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
