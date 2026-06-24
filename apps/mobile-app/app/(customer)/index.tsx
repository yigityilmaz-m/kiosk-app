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

  const renderSubCategory = ({ item }: { item: Category }) => {
    const isSelected = selectedSub?.id === item.id;
    return (
      <Pressable
        onPress={() => setSelectedSub(item)}
        className={`flex-1 m-1.5 py-8 rounded-2xl border items-center justify-center ${
          isSelected
            ? "bg-amber-500 border-amber-500"
            : "bg-white border-gray-200"
        }`}
      >
        <Text
          className={`text-base font-semibold ${
            isSelected ? "text-white" : "text-gray-700"
          }`}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <BasketSheetContext.Provider value={sheet}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="p-4 pt-20">
          <Text className="text-2xl font-bold text-gray-900">Our Menu</Text>
          <Text className="text-sm text-gray-400 mt-1">
            What would you like today?
          </Text>
        </View>
        <View className="flex-1">
          {/* Main category pills — always visible */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 gap-2 pb-3"
            >
              {mainCategories.map((cat) => {
                const isSelected = selectedMain?.id === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleSelectMain(cat)}
                    className={`px-5 py-2.5 rounded-full border ${
                      isSelected
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        isSelected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          {/* Sub category pills — always visible */}
          <View>
            {selectedMain && !selectedSub ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-4 gap-2 pb-3"
              >
                {subCategories.map((cat) => {
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedSub(cat)}
                      className={`px-5 py-2.5 rounded-full border bg-white border-gray-200`}
                    >
                      <Text className={`font-semibold text-sm text-gray-700`}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View className="flex-row px-5 py-2.5 rounded-full items-center justify-between">
                <Pressable
                  className=" px-4 py-4"
                  onPress={() => setSelectedSub(null)}
                >
                  <Text>⬅️</Text>
                </Pressable>
                <Text className={`font-semibold text-sm text-gray-700`}>
                  {selectedSub?.name}
                </Text>
                <View className=" px-4 py-4"></View>
              </View>
            )}
          </View>

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
                  console.log("refething");
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
      <BottomBar />
      <BasketSheet />
    </BasketSheetContext.Provider>
  );
}
