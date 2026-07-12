//Order list (left column)

import { STATUS_COLOR } from "@/lib/constants";
import { cn, formatOrderDate } from "@/lib/utils";
import { OrderWithItems } from "@/types/database";
import { Pressable, Text } from "react-native";

export const OrderListItem = ({
  order,
  isSelected,
  onPress,
}: {
  order: OrderWithItems;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "p-2 m-1 rounded-md border-2 border-brand-text",
        STATUS_COLOR[order.status],
        isSelected ? "border-brand-text" : `border-brand-border`,
      )}
    >
      <Text className="textBody text-brand-text">{order.customer_name}</Text>
      <Text className="textDetail  text-brand-text">
        {order.order_items.length} item
        {order.order_items.length !== 1 && "s"} · £{order.total}
      </Text>
      <Text className={cn("textDetail capitalize", STATUS_COLOR[order.status])}>
        {order.status}
      </Text>
      <Text className="textDetail  text-brand-text ">
        {formatOrderDate(order.created_at).day}
      </Text>
      <Text className="textDetail  text-brand-text ">
        {formatOrderDate(order.created_at).time}
      </Text>
    </Pressable>
  );
};
