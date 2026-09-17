import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listOrders, updateOrder } from "@/lib/cms";
import { gbp, shortDate } from "@/lib/vehicle-admin";

export const Route = createFileRoute("/admin/_authed/orders")({
  head: () => ({
    meta: [
      { title: "Payments & Orders | J1 Autoland CMS" },
      { name: "description", content: "Track vehicle deposits, reservations and full payment orders." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Payments & Orders | J1 Autoland CMS" },
      { property: "og:description", content: "Track deposits and vehicle orders." },
    ],
  }),
  component: Orders,
});

const STATUSES = ["pending", "paid", "failed", "refunded", "cancelled"];

function Orders() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "orders"], queryFn: listOrders });

  const patch = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrder(id, { status }),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell
      title="Payments & orders"
      description="Deposit reservations and full payments recorded from the checkout. Card processing can be connected later."
      breadcrumbs={[{ label: "Payments / Orders" }]}
    >
      <div className="mb-6 rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        Online card payments are not connected yet. This section already stores orders, references, amounts and
        statuses, so a payment provider can be switched on without changing the checkout design.
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-4">Reference</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Vehicle</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{o.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-3">{o.vehicle_label ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{o.payment_type}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold">{gbp(Number(o.amount))}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shortDate(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={o.status}
                      onValueChange={(status) => patch.mutate({ id: o.id, status })}
                    >
                      <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
