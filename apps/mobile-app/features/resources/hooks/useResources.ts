import { supabase } from "@/lib/supabase";
import { Resource } from "@shared/types/database";
import { useQuery } from "@tanstack/react-query";

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("name");
      if (error) throw error;

      return data as Resource[];
    },
  });
}
