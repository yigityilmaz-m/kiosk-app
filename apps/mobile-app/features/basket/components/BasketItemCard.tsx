import { View, Text, Image, Pressable } from "react-native";
import { Minus, Plus, X } from "lucide-react-native";
import { useBasketStore } from "@/features/basket/store";
import type { BasketItem } from "@/features/basket/store";

type Props = {
  item: BasketItem;
};

export default function BasketItemCard({ item }: Props) {
  const { incrementItem, decrementItem } = useBasketStore();

  const lineTotal = (item.resolvedPrice * item.quantity).toFixed(2);

  return (
    <View className="flex-row items-center py-3.5 border-b border-gray-100">
      {/* Product image */}
      <View className="w-14 h-14 rounded-full overflow-hidden bg-brand-subtle mr-4 flex-shrink-0">
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

      {/* Name + size label */}
      <View className="flex-1 mr-3">
        <Text className="textLabel text-brand-text" numberOfLines={1}>
          {item.product.name}
        </Text>
        {item.selectedSize && (
          <Text className="textDetail text-brand-muted">
            {item.selectedSize}
          </Text>
        )}
      </View>

      {/* Qty controls */}
      <View className="flex-row items-center w-[88px] justify-between mr-3 flex-shrink-0">
        <Pressable
          onPress={() => decrementItem(item.basketItemId)}
          hitSlop={8}
          className="w-7 h-7 rounded-lg border-2 border-brand-border items-center justify-center"
        >
          {item.quantity === 1 ? (
            <X size={12} color="#9CA3AF" strokeWidth={2.5} />
          ) : (
            <Minus size={12} color="#9CA3AF" strokeWidth={2.5} />
          )}
        </Pressable>

        <Text className="textBody text-center">{item.quantity}</Text>

        <Pressable
          onPress={() => incrementItem(item.basketItemId)}
          hitSlop={8}
          className="w-7 h-7 rounded-lg bg-gray-900 items-center justify-center"
        >
          <Plus size={12} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Price */}
      <Text className="textBody text-right flex-shrink-0 w-14">
        ${lineTotal}
      </Text>
    </View>
  );
}
