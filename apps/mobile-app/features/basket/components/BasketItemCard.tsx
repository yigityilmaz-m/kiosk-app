import { View, Text, Image, Pressable } from "react-native";
import { Minus, Plus, X } from "lucide-react-native";
import { useBasketStore } from "@/features/basket/store";
import type { BasketItem } from "@/features/basket/store";

interface Props {
  item: BasketItem;
}

export default function BasketItemCard({ item }: Props) {
  const { incrementItem, decrementItem } = useBasketStore();

  const lineTotal = (item.product.price * item.quantity).toFixed(2);

  return (
    <View className="flex-row items-center py-3.5 border-b border-gray-100">
      {/* Product image */}
      <View className="w-14 h-14 rounded-full overflow-hidden bg-amber-50 mr-4 flex-shrink-0">
        {item.product.image_url ? (
          <Image
            source={{ uri: item.product.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-amber-100 items-center justify-center">
            <Text className="text-xl">☕</Text>
          </View>
        )}
      </View>

      <View className="flex-1 mr-3">
        <Text
          className="text-sm font-bold text-gray-900 uppercase tracking-wide"
          numberOfLines={1}
        >
          {item.product.name}
        </Text>
      </View>

      <View className="flex-row items-center w-[88px] justify-between mr-3 flex-shrink-0">
        <Pressable
          onPress={() => decrementItem(item.product.id)}
          hitSlop={8}
          className="w-7 h-7 rounded-lg border border-gray-200 items-center justify-center"
        >
          {item.quantity === 1 ? (
            <X size={12} color="#9CA3AF" strokeWidth={2.5} />
          ) : (
            <Minus size={12} color="#9CA3AF" strokeWidth={2.5} />
          )}
        </Pressable>

        <Text className="text-sm font-bold text-gray-900 text-center">
          {item.quantity}
        </Text>

        <Pressable
          onPress={() => incrementItem(item.product.id)}
          hitSlop={8}
          className="w-7 h-7 rounded-lg bg-gray-900 items-center justify-center"
        >
          <Plus size={12} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      <Text className="text-sm font-bold text-gray-900 w-14 text-right flex-shrink-0">
        ${lineTotal}
      </Text>
    </View>
  );
}
