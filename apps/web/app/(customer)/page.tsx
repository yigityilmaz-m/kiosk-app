"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/features/products/hooks/useCategories";
import { AppHeader } from "@/components/AppHeader";
import { MainCategoryGrid } from "@/features/products/components/MainCategoryGrid";
import type { Category } from "@shared/types/database";
import ProductGrid from "@/features/products/components/ProductGrid";
import SubCategoryGrid from "@/features/products/components/SubCategoryGrid";

const MenuContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainSlug = searchParams.get("main");
  const subSlug = searchParams.get("sub");

  const { data: categories } = useCategories();

  const mainCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === null) ?? [],
    [categories],
  );

  const selectedMain =
    mainCategories.find((c) => c.slug === mainSlug) ??
    mainCategories[0] ??
    null;

  const subCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === selectedMain?.id) ?? [],
    [categories, selectedMain],
  );

  // No fallback to the first sub: no valid ?sub= means "show the sub grid"
  const selectedSub = subCategories.find((c) => c.slug === subSlug) ?? null;

  const handleSelectMain = (cat: Category) => {
    // replace: switching sidebar tabs shouldn't pile up history entries
    router.replace(`/?main=${cat.slug}`, { scroll: false });
  };

  const handleSelectSub = (cat: Category) => {
    if (!selectedMain) return;
    // push: browser back from a product list returns to the sub grid
    router.push(`/?main=${selectedMain.slug}&sub=${cat.slug}`, {
      scroll: false,
    });
  };

  const handleBackToSubs = () => {
    if (!selectedMain) return;
    router.push(`/?main=${selectedMain.slug}`, { scroll: false });
  };

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
          {selectedSub ? (
            <ProductGrid
              key={selectedSub.id}
              selectedSub={selectedSub}
              onBack={handleBackToSubs}
            />
          ) : selectedMain ? (
            <SubCategoryGrid
              subCategories={subCategories}
              onSelect={handleSelectSub}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CustomerPage = () => {
  return (
    <Suspense fallback={null}>
      <MenuContent />
    </Suspense>
  );
};

export default CustomerPage;
