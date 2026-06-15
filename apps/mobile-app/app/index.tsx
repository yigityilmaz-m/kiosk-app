import { cn } from "@/lib/utils";
import { View, Text, Button } from "react-native";
import { useBasketStore } from "@/features/basket/store";

export default function Index() {
  const { addItem, items, total, itemCount } = useBasketStore();

  console.log("Basket items:", items);
  console.log("Total:", total());
  console.log("Item count:", itemCount());

  return (
    <View
      className={cn(
        "flex-1 items-center justify-center",
        true ? "bg-amber-500" : "bg-gray-200",
        true && "opacity-50",
      )}
    >
      <Button
        title="Add Item"
        onPress={() =>
          addItem({
            id: "1",
            name: "Test Product",
            price: 9.99,
            image_url: null,
          })
        }
      />
      <Text className="text-white text-2xl font-bold">{total()}</Text>
    </View>
  );
}
