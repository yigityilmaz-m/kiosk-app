"use client";

import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase/client";
import type { Product } from "@shared/types/database";

async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabaseClient()
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
