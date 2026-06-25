import {
  useWindowDimensions,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useBasketSheet } from "@/features/basket/hooks/useBasketSheet";
import { useBasketStore } from "@/features/basket/store";
import BasketItemCard from "./BasketItemCard";
import { X } from "lucide-react-native";

const SHEET_HEIGHT_RATIO = 0.55;

export function BasketSheet() {
  const { height } = useWindowDimensions();
  const sheetHeight = height * SHEET_HEIGHT_RATIO;
  const { translateY, close } = useBasketSheet();
  const { items, total } = useBasketStore();

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(translateY.value, [0, 1], [0, sheetHeight]) },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 1], [0.5, 0]),
    pointerEvents: translateY.value === 0 ? "auto" : "none",
  }));

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black z-10"
        style={backdropStyle}
      >
        <Pressable className="absolute inset-0" onPress={close} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-20"
        style={[{ height: sheetHeight }, sheetStyle]}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-3 border-b border-gray-100">
          <View></View>
          <Text className="text-lg font-bold text-gray-900">Your Basket</Text>
          <Pressable onPress={close} hitSlop={12}>
            <X />
          </Pressable>
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 text-sm">Your basket is empty</Text>
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1"
              contentContainerClassName="px-5 py-2"
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <BasketItemCard
                  item={item}
                  key={item.product.id}
                ></BasketItemCard>
              ))}
            </ScrollView>

            {/* Total */}
            <View className="flex-row justify-between items-center px-5 py-4 border-t border-gray-100">
              <Text className="text-base font-bold text-gray-900">Total</Text>
              <Text className="text-lg font-bold text-gray-900">
                ${total().toFixed(2)}
              </Text>
            </View>
          </>
        )}
      </Animated.View>
    </>
  );
}
