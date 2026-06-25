import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  BasketSheetContext,
  useBasketSheetValue,
} from "@/features/basket/hooks/useBasketSheet";
import { ProductCard } from "@/features/products/components/ProductCard";
import { BasketSheet } from "@/features/basket/components/BasketSheet";
import { BottomBar } from "@/components/BottomBar";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";
import type { Product, Category } from "@/types/database";
import { SubCategoryCard } from "@/features/products/components/SubCategoryCard";
import { MoveLeft } from "lucide-react-native";
import { cn } from "@/lib/utils";

export default function ProductListingScreen() {
  const sheet = useBasketSheetValue();
  const { data: categories } = useCategories();

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

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts(selectedSub?.id);

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

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderSubCategories = ({ item }: { item: Category }) => (
    <Pressable
      key={item.id}
      className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm mx-1 mb-3"
      onPress={() => setSelectedSub(item)}
    >
      <SubCategoryCard category={item} />
    </Pressable>
  );

  return (
    <BasketSheetContext.Provider value={sheet}>
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="p-4 pt-20">
          <Text className="text-2xl font-bold text-gray-900">Our Menu</Text>
          <Text className="text-sm text-gray-400 mt-1">
            What would you like today?
          </Text>
        </View>
        <View className="flex-1 flex-row bg-white rounded-t-3xl mt-2 pt-6">
          {/* Main category pills — always visible */}
          <View className="min-w-20 max-w-36 bg-gray-50 rounded-t-3xl">
            <ScrollView
              showsHorizontalScrollIndicator={false}
              bounces={false}
              contentContainerClassName="py-2 gap-4 "
            >
              {mainCategories.map((cat) => {
                const isSelected = selectedMain?.id === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleSelectMain(cat)}
                    className={cn(
                      `mx-2 mb-1 px-2 py-3 rounded-xl items-center justify-center shadow-sm`,
                      isSelected ? "bg-gray-900" : "bg-white",
                    )}
                  >
                    <Text
                      className={cn(
                        `text-xs font-semibold text-center`,
                        isSelected ? "text-white" : "text-gray-500",
                      )}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          <View className="flex-1">
            {/* Sub categories*/}
            {selectedMain && !selectedSub ? (
              <FlatList
                data={subCategories}
                renderItem={renderSubCategories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerClassName="px-3 pt-2 pb-24"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center pt-16">
                    <Text className="text-gray-400 text-sm">
                      No items here yet.
                    </Text>
                  </View>
                }
              />
            ) : (
              <View className="flex-row px-5 py-2.5 rounded-full items-center justify-between">
                <Pressable
                  className="p-2.5"
                  onPress={() => setSelectedSub(null)}
                >
                  <MoveLeft />
                </Pressable>
                <Text
                  className={`font-semibold text-l text-gray-700 text-center`}
                >
                  {selectedSub?.name}
                </Text>
                <View className=" p-2.5 opacity-0">
                  <MoveLeft />
                </View>
              </View>
            )}

            {/* Subcategory selected — loading */}
            {selectedSub && isLoading && (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#111827" />
              </View>
            )}

            {/* Subcategory selected — error */}
            {selectedSub && isError && (
              <View className="flex-1 items-center justify-center px-8">
                <Text className="text-gray-400 text-center">
                  Could not load products. Please try again.
                </Text>
                <Pressable
                  className="bg-gray-900 rounded-2xl py-4 px-5 items-center mt-4"
                  onPress={() => {
                    refetch();
                  }}
                >
                  <Text className="text-white font-bold text-base">Retry</Text>
                </Pressable>
              </View>
            )}

            {/* Subcategory selected — product grid */}
            {selectedSub && !isLoading && !isError && (
              <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerClassName="px-3 pt-2 pb-24"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center pt-16">
                    <Text className="text-gray-400 text-sm">
                      No items here yet.
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </View>
      <BottomBar />
      <BasketSheet />
    </BasketSheetContext.Provider>
  );
}
