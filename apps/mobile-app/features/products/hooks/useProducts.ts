import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/database";

async function fetchProducts(categoryId?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("name");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export function useProducts(categoryId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProducts(categoryId),
    enabled: !!categoryId,
    retry: 2,
  });

  useEffect(() => {
    query.data?.forEach((product) => {
      queryClient.setQueryData(["product", product.id], product);
    });
  }, [query.data, queryClient]);

  return query;
}
