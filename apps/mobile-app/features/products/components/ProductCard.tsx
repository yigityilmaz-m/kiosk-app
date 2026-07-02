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
        <Text className="textBody leading-tight" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="textBody leading-tight text-brand">
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
