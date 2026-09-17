import { createFileRoute, redirect } from "@tanstack/react-router";
import { stockSearch, type StockSearch } from "@/lib/stock-search";

/**
 * Legacy URL. The inventory now lives at /stocklist — every /stock link keeps
 * working and carries its filters across.
 */
export const Route = createFileRoute("/stock")({
  validateSearch: (search: Record<string, unknown>): StockSearch =>
    stockSearch(search as Partial<StockSearch>),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/stocklist", search });
  },
});
