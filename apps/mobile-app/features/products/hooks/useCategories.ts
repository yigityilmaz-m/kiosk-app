import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/database";

async function fetchCategories(): Promise<Category[]> {
  let query = supabase.from("categories").select("*").order("sort_order");

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
