import { View, Text, Pressable, Image } from "react-native";
import type { Product } from "@/types/database";

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable
      className="flex-1 bg-white rounded-2xl mx-1 shadow-card my-3"
      style={{ elevation: 3 }}
      onPress={onPress}
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
      </View>
    </Pressable>
  );
}
