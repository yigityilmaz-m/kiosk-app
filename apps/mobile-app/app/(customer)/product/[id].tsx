import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { X } from "lucide-react-native";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useBasketStore } from "@/features/basket/store";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(id);
  const { addItem } = useBasketStore();

  const [selectedSize, setSelectedSize] = useState<"Small" | "Large" | null>(
    null,
  );

  const hasVariants = product?.large_price != null;

  const resolvedPrice = hasVariants
    ? selectedSize === "Large"
      ? product!.large_price!
      : selectedSize === "Small"
        ? product!.price
        : null
    : (product?.price ?? null);

  const canAdd = !!product && (!hasVariants || selectedSize !== null);

  function handleAdd() {
    if (!canAdd || !product) return;
    addItem(product, hasVariants ? selectedSize : null);
    router.back();
  }

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-gray-400 text-sm text-center">
          Couldn&apos;t load this product. Please go back and try again.
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-amber-600 font-bold text-sm">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/10 items-center justify-center"
      >
        <X size={18} color="#374151" strokeWidth={2} />
      </Pressable>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full h-72 bg-amber-50">
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-7xl">☕</Text>
            </View>
          )}
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-black text-gray-900 flex-1 mr-4">
              {product.name}
            </Text>
            <Text className="text-2xl font-black text-amber-600">
              {resolvedPrice != null
                ? `$${resolvedPrice.toFixed(2)}`
                : `From $${product.price.toFixed(2)}`}
            </Text>
          </View>

          {product.description ? (
            <Text className="text-sm text-gray-500 leading-relaxed mb-6">
              {product.description}
            </Text>
          ) : (
            <View className="mb-6" />
          )}

          {hasVariants && (
            <View className="mb-6">
              <Text className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Choose Size
              </Text>
              <View className="flex-row gap-x-3">
                {(["Small", "Large"] as const).map((size) => {
                  const sizePrice =
                    size === "Small" ? product.price : product.large_price!;
                  const isSelected = selectedSize === size;
                  return (
                    <Pressable
                      key={size}
                      onPress={() => setSelectedSize(size)}
                      className={`flex-1 py-4 rounded-2xl border-2 items-center ${
                        isSelected
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold mb-1 ${
                          isSelected ? "text-amber-600" : "text-gray-700"
                        }`}
                      >
                        {size}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isSelected ? "text-amber-500" : "text-gray-400"
                        }`}
                      >
                        ${sizePrice.toFixed(2)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-3 border-t border-gray-100">
        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          className={`rounded-2xl py-4 items-center ${
            canAdd ? "bg-amber-600" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-black text-sm uppercase tracking-widest ${
              canAdd ? "text-white" : "text-gray-400"
            }`}
          >
            {hasVariants && !selectedSize ? "Select a Size" : "Add to Basket"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
