import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderStatus, OrderWithItems } from "@/types/database";
import { useEffect } from "react";

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
    .select("*, order_items(*, products(*))")
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
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["orders", filter],
    queryFn: () => fetchOrders(filter),
    staleTime: 30 * 1000,
  });
}
