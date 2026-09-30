"use client";

import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase/client";
import type { Category } from "@shared/types/database";

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabaseClient()
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
