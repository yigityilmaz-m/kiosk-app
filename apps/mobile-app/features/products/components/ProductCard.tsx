import { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useBasketStore } from "@/features/basket/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const addItem = useBasketStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAdd = () => {
    if (added) return;

    addItem(product);
    setAdded(true);

    // Brief press-down then bounce back
    scale.value = withSequence(
      withTiming(0.92, { duration: 80, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 120, easing: Easing.out(Easing.back(3)) }),
    );

    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <View
      className="flex-1 bg-white rounded-2xl mx-1 shadow-card my-3"
      style={{ elevation: 3 }}
    >
      {/* Product image */}
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          className="w-full h-32"
          resizeMode="contain"
        />
      ) : (
        <View className="w-full h-28 bg-gray-100 items-center justify-center rounded-2xl">
          <Text className="text-3xl">☕</Text>
        </View>
      )}

      {/* Info */}
      <View className="p-3 gap-2">
        <Text
          className="text-sm font-semibold text-gray-900 leading-tight"
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <Text className="text-sm font-bold text-amber-500">
          ${product.price.toFixed(2)}
        </Text>

        {/* Add button */}
        <Animated.View style={animatedStyle}>
          <Pressable
            className={cn(
              "rounded-xl py-2 items-center justify-center",
              added ? "bg-green-500" : "bg-gray-900",
            )}
            onPress={handleAdd}
          >
            <Text className="text-white text-sm font-bold">
              {added ? "✓" : "+"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
