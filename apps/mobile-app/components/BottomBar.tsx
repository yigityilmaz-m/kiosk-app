import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { cn } from "@/lib/utils";
import { useBasketSheet } from "@/features/basket/hooks/useBasketSheet";
import { useBasketStore } from "@/features/basket/store";
import { ShoppingBasket, ReceiptText } from "lucide-react-native";

export function BottomBar() {
  const { open } = useBasketSheet();
  const itemCount = useBasketStore((s) => s.itemCount());
  const total = useBasketStore((s) => s.total());

  return (
    <View className="flex-row h-20 bg-white border-t  border-gray-200">
      {/* Cart button */}
      <Pressable
        className="flex-1 flex-row items-center justify-center gap-2"
        onPress={open}
      >
        <ShoppingBasket />
        <Text className="text-sm font-bold text-gray-900 tracking-widest">
          CART
        </Text>
        {itemCount !== 0 && (
          <View className="bg-gray-900 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
            <Text className="text-xs font-bold text-white">{itemCount}</Text>
          </View>
        )}
      </Pressable>

      {/* Checkout button */}
      <Pressable
        className={cn(
          "flex-1 flex-row items-center justify-center gap-2 bg-red-600",
          itemCount === 0 && "opacity-50",
        )}
        onPress={() => router.push("/(customer)/checkout")}
        disabled={itemCount === 0}
      >
        <ReceiptText />
        <Text className="text-sm font-bold text-white tracking-widest">
          CHECKOUT
        </Text>
        {itemCount !== 0 && (
          <Text className="text-xs font-semibold text-white/80">
            ${total.toFixed(2)}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
