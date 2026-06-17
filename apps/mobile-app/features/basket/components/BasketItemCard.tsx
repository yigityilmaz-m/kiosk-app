import { View, Text, Pressable } from "react-native";
import React from "react";
import { BasketItem, useBasketStore } from "../store";

const BasketItemCard = ({ item }: { item: BasketItem }) => {
  const { incrementItem, decrementItem, removeItem } = useBasketStore();

  return (
    <View
      key={item.product.id}
      className="flex-row justify-between items-center py-3 border-b border-gray-100"
    >
      <View className="flex-1 gap-1">
        <Text className="text-sm font-semibold text-gray-900">
          {item.product.name}
        </Text>
        <Text className="text-sm text-gray-400">
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
          onPress={() => decrementItem(item.product.id)}
          hitSlop={8}
        >
          <Text className="text-base font-semibold text-gray-900">−</Text>
        </Pressable>

        <Text className="text-sm font-semibold text-gray-900 min-w-[20px] text-center">
          {item.quantity}
        </Text>

        <Pressable
          className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
          onPress={() => incrementItem(item.product.id)}
          hitSlop={8}
        >
          <Text className="text-base font-semibold text-gray-900">+</Text>
        </Pressable>

        <Pressable
          className="w-7 h-7 rounded-full bg-red-100 items-center justify-center"
          onPress={() => removeItem(item.product.id)}
          hitSlop={8}
        >
          <Text className="text-xs text-red-500">✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BasketItemCard;
