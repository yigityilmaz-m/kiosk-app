import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { cn } from "@/lib/utils";
import { useBasketSheet } from "@/features/basket/hooks/useBasketSheet";
import { useBasketStore } from "@/features/basket/store";
import { ShoppingBasket, ReceiptText } from "lucide-react-native";

export const BottomBar = () => {
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
        <ShoppingBasket color={"#374151"} />
        <Text className="textLabel text-brand-text">CART</Text>
        {itemCount !== 0 && (
          <View className="bg-brand-text rounded-full items-center justify-center px-0.5">
            <Text className="textDetail text-white"> {itemCount} </Text>
          </View>
        )}
      </Pressable>

      {/* Checkout button */}
      <Pressable
        className={cn(
          "flex-1 flex-row items-center justify-center gap-2 bg-brand-continue",
          itemCount === 0 && "opacity-50",
        )}
        onPress={() => router.push("/(customer)/checkout")}
        disabled={itemCount === 0}
      >
        <ReceiptText color={"white"} />
        <Text className="textLabel text-white">CHECKOUT</Text>
        {itemCount !== 0 && (
          <Text className="textDetail text-white">${total.toFixed(2)}</Text>
        )}
      </Pressable>
    </View>
  );
};
