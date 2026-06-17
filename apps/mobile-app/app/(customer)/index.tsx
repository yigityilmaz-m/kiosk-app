import { View, Text, FlatList, ActivityIndicator } from "react-native";
import {
  BasketSheetContext,
  useBasketSheetValue,
} from "@/features/basket/hooks/useBasketSheet";
import { ProductCard } from "@/features/products/components/ProductCard";
import { BasketSheet } from "@/features/basket/components/BasketSheet";
import { BottomBar } from "@/components/BottomBar";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/types/database";

export default function ProductListingScreen() {
  const sheet = useBasketSheetValue();
  const { data: products, isLoading, isError } = useProducts();

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-14 pb-4 bg-gray-50">
        <Text className="text-2xl font-bold text-gray-900">Our Menu</Text>
        <Text className="text-sm text-gray-400 mt-1">
          What would you like today?
        </Text>
      </View>

      {/* States */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#111827" />
        </View>
      )}

      {isError && (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 text-center">
            Could not load products. Please try again.
          </Text>
        </View>
      )}

      {/* Product grid */}
      {products && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerClassName="px-3 pt-2 pb-24"
          showsVerticalScrollIndicator={false}
        />
      )}
      <BasketSheetContext.Provider value={sheet}>
        <BottomBar />
        <BasketSheet />
      </BasketSheetContext.Provider>
    </View>
  );
}
