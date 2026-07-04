import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderStatus, OrderWithItems } from "@/types/database";

export type OrderFilter = "all" | "active" | "completed" | "cancelled";

const STATUS_MAP: Record<OrderFilter, OrderStatus[] | null> = {
  all: null,
  active: ["pending", "preparing"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

async function fetchOrders(filter: OrderFilter): Promise<OrderWithItems[]> {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const statuses = STATUS_MAP[filter];
  if (statuses) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as OrderWithItems[];
}

export function useOrders(filter: OrderFilter = "active") {
  return useQuery({
    queryKey: ["orders", filter],
    queryFn: () => fetchOrders(filter),
    staleTime: 30 * 1000, // 30s — staff screen stays fresh without hammering Supabase
  });
}
