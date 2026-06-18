import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Pressable,
} from "react-native";
import {
  BasketSheetContext,
  useBasketSheetValue,
} from "@/features/basket/hooks/useBasketSheet";
import { ProductCard } from "@/features/products/components/ProductCard";
import { BasketSheet } from "@/features/basket/components/BasketSheet";
import { BottomBar } from "@/components/BottomBar";
import type { Product } from "@/types/database";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useEffect } from "react";
import { toast } from "sonner-native";

export default function ProductListingScreen() {
  const sheet = useBasketSheetValue();

  const { data: products, isLoading, isError, refetch } = useProducts();

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  useEffect(() => {
    if (isError) {
      toast.error("Could not load the menu", {
        style: { backgroundColor: "red" },
        duration: 1500,
      });
    }
  }, [isError, refetch]);

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
            Could not load the menu. Please try again.
          </Text>
          <Pressable
            className="bg-gray-900 rounded-2xl py-4 px-5 items-center mt-4"
            onPress={() => refetch()}
            //TODO: pop all the way back to menu instead of replace
          >
            <Text className="text-white font-bold text-base">Retry</Text>
          </Pressable>
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
