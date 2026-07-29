import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// features/resources/hooks/useCreateResource.ts
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      unit: string;
      current_stock: number;
      low_stock_threshold: number;
    }) => {
      const { error } = await supabase.from("resources").insert(input);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
  });
}
