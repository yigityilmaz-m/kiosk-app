import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdjustResourceStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceId,
      delta,
    }: {
      resourceId: string;
      delta: number;
    }) => {
      const { error } = await supabase.rpc("adjust_resource_stock", {
        resource_id_input: resourceId,
        delta_input: delta,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
}
