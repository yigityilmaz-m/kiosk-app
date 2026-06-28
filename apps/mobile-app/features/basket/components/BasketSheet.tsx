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
import { MoveRight, X } from "lucide-react-native";
import { useRouter } from "expo-router";

const SHEET_HEIGHT_RATIO = 0.72;

export function BasketSheet() {
  const { height } = useWindowDimensions();
  const sheetHeight = height * SHEET_HEIGHT_RATIO;
  const { translateY, close } = useBasketSheet();
  const { items, total } = useBasketStore();
  const router = useRouter();

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(translateY.value, [0, 1], [0, sheetHeight]) },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 1], [0.5, 0]),
    pointerEvents: translateY.value === 0 ? "auto" : "none",
  }));

  function handleCheckout() {
    close();
    router.push("/(customer)/checkout");
  }

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black z-10"
        style={backdropStyle}
      >
        <Pressable className="absolute inset-0" onPress={close} />
      </Animated.View>

      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-20"
        style={[{ height: sheetHeight }, sheetStyle]}
      >
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 rounded-full bg-gray-200" />
        </View>

        {/* Title */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100">
          <View className="w-8" />
          <Text className="text-base font-black tracking-widest uppercase text-gray-900">
            Cart
          </Text>
          <Pressable
            onPress={close}
            hitSlop={12}
            className="w-8 h-8 justify-center items-end"
          >
            <X size={20} color="#374151" strokeWidth={2} />
          </Pressable>
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 text-sm">Your basket is empty</Text>
          </View>
        ) : (
          <>
            {/* Items */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 8,
              }}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <BasketItemCard item={item} key={item.basketItemId} />
              ))}
            </ScrollView>

            <View className="mx-5 mb-4 px-4 py-3.5 bg-gray-50 rounded-2xl flex-row justify-between items-center">
              <Text className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Total Order
              </Text>
              <Text className="text-lg font-black text-gray-900">
                ${total().toFixed(2)}
              </Text>
            </View>

            <Pressable
              onPress={handleCheckout}
              className="mx-5 mb-6  bg-red-600 rounded-2xl py-4 flex-row items-center justify-center gap-x-2"
            >
              <Text className="text-white font-black text-sm uppercase tracking-widest">
                Continue to Payment
              </Text>
              <MoveRight color="#FFFFFF" strokeWidth={2} />
            </Pressable>
          </>
        )}
      </Animated.View>
    </>
  );
}
