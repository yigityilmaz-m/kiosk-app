//Order detail (right column)
import { OrderStatus, OrderWithItems } from "@/types/database";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { ScrollView, Text, View } from "react-native";
import { ContinueButton } from "@/components/ContinueButton";
import { OrderDetailItem } from "./OrderDetailItem";
import { cn } from "@/lib/utils";
import { STATUS_COLOR } from "@/lib/constants";

const nextStatus: Record<string, { label: string; value: OrderStatus }> = {
  pending: { label: "Prepare", value: "preparing" },
  preparing: { label: "Complere", value: "completed" },
};

export const OrderDetail = ({ order }: { order: OrderWithItems }) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const canAct = order.status === "pending" || order.status === "preparing";

  return (
    <View className="flex-1 m-1 ">
      <View className="flex-1 p-1 justify-between rounded-md border-2 bg-white border-brand-border">
        <View className="items-center">
          <Text className="textHeader text-brand-text">
            {order.customer_name}
          </Text>
          <Text className="textLabel text-brand-text">
            Total: £{order.total}
          </Text>
          <Text className="textLabel text-brand-text">
            {order.order_items.length} · Item
            {order.order_items.length > 0 && "s"}
          </Text>
          <Text className={cn("textLabel px-2", STATUS_COLOR[order.status])}>
            {order.status}
          </Text>
        </View>

        <ScrollView className="flex-1">
          {order.order_items.map((item) => (
            <OrderDetailItem key={item.id} item={item}></OrderDetailItem>
          ))}
        </ScrollView>
      </View>

      {
        //TODO: Change Style
      }
      {canAct && (
        <View className="flex-row items-center m-3">
          <ContinueButton
            label="Decline"
            onPress={() =>
              updateStatus({ orderId: order.id, status: "cancelled" })
            }
            iconRight={false}
            className="flex-1 bg-brand-muted border-2 border-brand-border"
            isLoading={isPending}
            isDisabled={isPending}
          />
          <ContinueButton
            label={nextStatus[order.status].label ?? "Proceed"}
            onPress={() =>
              updateStatus({
                orderId: order.id,
                status: nextStatus[order.status].value,
              })
            }
            iconRight={false}
            className="flex-1"
            isLoading={isPending}
            isDisabled={isPending}
          />
        </View>
      )}
    </View>
  );
};
