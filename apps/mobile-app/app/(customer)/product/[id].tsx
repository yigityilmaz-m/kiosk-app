import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { X } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useBasketStore } from "@/features/basket/store";
import { cn } from "@/lib/utils";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { addItem } = useBasketStore();
  const isPresented = router.canGoBack();
  const [selectedSize, setSelectedSize] = useState<"Small" | "Large" | null>(
    null,
  );
  const { height } = Dimensions.get("window");

  const imageHeightRatio = useSharedValue(0);

  useEffect(() => {
    imageHeightRatio.value = withTiming(selectedSize === "Large" ? 0.6 : 0.45, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [selectedSize, imageHeightRatio]);

  const imageContainerStyle = useAnimatedStyle(() => ({
    height: imageHeightRatio.value * height,
  }));

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#D97706" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Text className="text-gray-400 text-sm text-center">
          Couldn&apos;t load this product.
        </Text>
        <Pressable onPress={() => refetch()} className="mt-4">
          <Text className="text-brand font-bold text-sm">Retry</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-brand font-bold text-sm">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {isPresented && (
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/10 items-center justify-center"
        >
          <X size={18} color="#374151" strokeWidth={2} />
        </Pressable>
      )}

      <View className="flex-1">
        <View className="flex-1 bg-brand-subtle rounded-full justify-center items-center">
          {product.image_url ? (
            <Animated.View
              style={imageContainerStyle}
              className="aspect-square"
            >
              <Image
                source={{ uri: product.image_url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="stretch"
              />
            </Animated.View>
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-7xl">☕</Text>
            </View>
          )}
        </View>

        <View className="px-5 pt-5">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="textTitle text-brand-text  flex-1 mr-4">
              {product.name}
            </Text>
            <Text className="textTitle text-brand">
              {resolvedPrice != null
                ? `$${resolvedPrice.toFixed(2)}`
                : `From $${product.price.toFixed(2)}`}
            </Text>
          </View>

          {product.description ? (
            <Text className="textDetail text-brand-muted leading-relaxed mb-6">
              {product.description}
            </Text>
          ) : (
            <View className="mb-6" />
          )}

          {hasVariants && (
            <View className="mb-6">
              <Text className="textLabel text-brand-muted mb-3">
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
                          ? "border-brand bg-brand-subtle"
                          : "border-brand-border white"
                      }`}
                    >
                      <Text
                        className={cn(
                          "textBody text-brand-muted",
                          isSelected && "text-brand",
                        )}
                      >
                        {size}
                      </Text>
                      <Text
                        className={cn(
                          "textDetail text-brand-muted",
                          isSelected && "text-brand",
                        )}
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
      </View>

      <View className="px-5 pb-8 pt-3 border-t border-brand-border">
        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          className={cn(
            "rounded-2xl py-4 items-center",
            canAdd
              ? " bg-brand-continue"
              : "bg-brand-bg  border-brand-border border-2",
          )}
        >
          <Text
            className={cn(
              "textTitle",
              canAdd ? "text-white" : "text-brand-muted",
            )}
          >
            {hasVariants && !selectedSize ? "Select a Size" : "Add to Basket"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
