"use client";

import { useMemo, useState } from "react";
import { useCategories } from "@/features/products/hooks/useCategories";
import { AppHeader } from "@/components/AppHeader";
import { MainCategoryGrid } from "@/features/products/components/MainCategoryGrid";
import { SubCategoryGrid } from "@/features/products/components/SubCategoryGrid";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import type { Category } from "@shared/types/database";

export default function CustomerPage() {
  const { data: categories } = useCategories();

  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [selectedSubId, setselectedSubId] = useState<string | null>(null);

  const mainCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === null) ?? [],
    [categories],
  );

  const selectedMain =
    mainCategories.find((c) => c.id === selectedMainId) ??
    mainCategories[0] ??
    null;

  const subCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === selectedMain?.id) ?? [],
    [categories, selectedMain],
  );

  const selectedSub =
    subCategories.find((c) => c.id === selectedSubId) ??
    subCategories[0] ??
    null;

  function handleSelectMain(cat: Category) {
    setSelectedMainId(cat.id);
    setselectedSubId(null);
  }

  return (
    <div className="flex h-dvh flex-col bg-[#f8fafc]">
      <AppHeader />

      <div className="relative -mt-8 flex min-h-0 flex-1 overflow-hidden rounded-t-3xl bg-white pt-4">
        <MainCategoryGrid
          categories={mainCategories}
          selectedMain={selectedMain}
          onSelect={handleSelectMain}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {selectedMain && !selectedSubId ? (
            <SubCategoryGrid
              subCategories={subCategories}
              onSelect={(cat) => setselectedSubId(cat.id)}
            />
          ) : selectedSubId ? (
            <ProductGrid
              key={selectedSubId}
              selectedSub={selectedSub}
              onBack={() => setselectedSubId(null)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
