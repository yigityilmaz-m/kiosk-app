import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetResourceStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceId,
      newValue,
    }: {
      resourceId: string;
      newValue: number;
    }) => {
      const { error } = await supabase.rpc("set_resource_stock", {
        resource_id_input: resourceId,
        new_value: newValue,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
}
