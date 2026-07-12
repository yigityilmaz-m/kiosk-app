import { OrderItemWithProduct } from "@/types/database";
import { Image, Text, View } from "react-native";

export const OrderDetailItem = ({ item }: { item: OrderItemWithProduct }) => {
  return (
    <View className="flex-row justify-between py-2 border-b border-brand-border items-center">
      <Image
        source={{
          uri: item.products.image_url
            ? item.products.image_url
            : `https://placehold.co/112x112/E8D5B7/C4A882?text=${encodeURIComponent(item.products.name.charAt(0))}`,
        }}
        resizeMode="cover"
        className="w-16 h-16 rounded-md"
      />
      <View className="flex-1">
        <Text className="textBody text-brand-text">{item.products.name}</Text>
        <Text className="textDetail text-brand-muted">
          {item.selected_size}
        </Text>
      </View>
      <Text className="text-brand-text text-sm">x{item.quantity}</Text>
      <Text className="text-brand-text text-sm w-14 text-right">
        £{item.price_at_order_time}
      </Text>
    </View>
  );
};
