import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/types/database";

async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw error;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Invalidate all order filter variants so every tab re-fetches
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
