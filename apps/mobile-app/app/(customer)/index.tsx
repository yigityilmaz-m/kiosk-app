import { View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  BasketSheetContext,
  useBasketSheetValue,
} from "@/features/basket/hooks/useBasketSheet";
import { BasketSheet } from "@/features/basket/components/BasketSheet";
import { BottomBar } from "@/components/BottomBar";
import { useCategories } from "@/features/products/hooks/useCategories";
import type { Category } from "@/types/database";
import { useHiddenStaffTrigger } from "@/features/auth/hooks/useHiddeenStaffTrigger";
import { AppHeader } from "@/components/AppHeader";
import { MainCategoryGrid } from "@/features/products/components/MainCategoryGrid";
import { SubCategoryGrid } from "@/features/products/components/SubCategoryGrid";
import { ProductGrid } from "@/features/products/components/ProductGrid";

export default function ProductListingScreen() {
  const sheet = useBasketSheetValue();
  const { data: categories } = useCategories();
  const handleHiddenTrigger = useHiddenStaffTrigger();

  const [selectedMain, setSelectedMain] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<Category | null>(null);

  const mainCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === null) ?? [],
    [categories],
  );

  const subCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === selectedMain?.id) ?? [],
    [categories, selectedMain],
  );

  function handleSelectMain(cat: Category) {
    setSelectedMain(cat);
    setSelectedSub(null);
  }

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedMain) {
      const firstMain = categories.find((c) => c.parent_id === null);
      if (firstMain) setSelectedMain(firstMain);
    }
  }, [categories, selectedMain]);

  return (
    <BasketSheetContext.Provider value={sheet}>
      <View className="flex-1 bg-[#f8fafc]">
        <AppHeader onHiddenTrigger={handleHiddenTrigger} />

        <View className="flex-1 flex-row bg-white rounded-t-3xl -mt-8 pt-4">
          <MainCategoryGrid
            categories={mainCategories}
            selectedMain={selectedMain}
            onSelect={handleSelectMain}
          />

          <View className="flex-1">
            {selectedMain && !selectedSub ? (
              <SubCategoryGrid
                subCategories={subCategories}
                onSelect={setSelectedSub}
              />
            ) : selectedSub ? (
              <ProductGrid
                key={selectedSub.id}
                selectedSub={selectedSub}
                onBack={() => setSelectedSub(null)}
              />
            ) : null}
          </View>
        </View>
      </View>

      <BottomBar />
      <BasketSheet />
    </BasketSheetContext.Provider>
  );
}
