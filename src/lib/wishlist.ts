import { useCallback, useEffect, useState } from "react";

const KEY = "aurex-wishlist";
const listeners = new Set<(ids: string[]) => void>();
let ids: string[] = [];

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(ids));
}

export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      ids = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      ids = [];
    }
    setItems(ids);
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    ids = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
    persist();
  }, []);

  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, toggle, has };
}
