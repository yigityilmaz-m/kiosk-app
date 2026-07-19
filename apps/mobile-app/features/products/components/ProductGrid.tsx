import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Category } from "@/types/database";
import { useProducts } from "@/features/products/hooks/useProducts";

type ProductGridProps = {
  selectedSub: Category;
  onBack: () => void;
};

export const ProductGrid = ({ selectedSub, onBack }: ProductGridProps) => {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts(selectedSub?.id);
  return (
    <>
      <View className="flex-row px-3 py-2.5 items-center justify-between">
        <Pressable className="p-2" onPress={onBack}>
          <MoveLeft size={20} color="#374151" strokeWidth={2} />
        </Pressable>
        <Text className="textTitle text-brand-text text-center flex-1">
          {selectedSub.name}
        </Text>
        {/* Invisible spacer for optical centering */}
        <View className="p-2 opacity-0">
          <MoveLeft size={20} color="#374151" strokeWidth={2} />
        </View>
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="color-brand" />
        </View>
      )}

      {!isLoading && isError && (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-400 text-center text-sm">
            Could not load products. Please try again.
          </Text>
          <Pressable
            className="bg-gray-900 rounded-2xl py-3 px-6 items-center mt-4"
            onPress={() => refetch()}
          >
            <Text className="text-white font-bold text-sm">Retry</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/(customer)/product/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-16">
              <Text className="text-gray-400 text-sm">No items here yet.</Text>
            </View>
          }
        />
      )}
    </>
  );
};
