import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState } from "react";
import { StaffGuard } from "@/features/auth/components/StaffGuard";
import { useOrders, OrderFilter } from "@/features/orders/hooks/useOrders";
import type { OrderWithItems } from "@/types/database";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { ContinueButton } from "@/components/ContinueButton";

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: OrderFilter }[] = [
  { label: "Active", value: "active" },
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function FilterBar({
  active,
  onChange,
}: {
  active: OrderFilter;
  onChange: (f: OrderFilter) => void;
}) {
  return (
    <SafeAreaView className="flex-row gap-2 p-3">
      {FILTERS.map((f) => (
        <Pressable
          key={f.value}
          onPress={() => onChange(f.value)}
          className={cn(
            "px-4 py-1.5 rounded-full border-2 border-brand-text",
            active === f.value
              ? "bg-amber-500 "
              : "bg-white  border-brand-border ",
          )}
        >
          <Text className={`text-sm font-medium text-brand-text px-1`}>
            {f.label}
          </Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

// ─── Order list (left column) ─────────────────────────────────────────────────

function OrderListItem({
  order,
  isSelected,
  onPress,
}: {
  order: OrderWithItems;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "px-2 py-1.5 m-1 rounded-md border-2 border-brand-text",
        isSelected ? "bg-brand-subtle" : "bg-white border-brand-border ",
      )}
    >
      <Text className="textBody text-brand-text">{order.customer_name}</Text>
      <Text className="textDetail  text-brand-text">
        {order.order_items.length} item
        {order.order_items.length !== 1 && "s"} · £{order.total}
      </Text>
      <Text className="textDetail text-brand capitalize">{order.status}</Text>
      <Text className="textDetail  text-brand-text ">{order.created_at}</Text>
    </Pressable>
  );
}

// ─── Order detail (right column) ──────────────────────────────────────────────

function OrderDetail({ order }: { order: OrderWithItems }) {
  return (
    <View className="flex-1 bg-brand-bg p-2 justify-between">
      <>
        <Text className="textLabel text-brand-text">{order.customer_name}</Text>
        <Text className="textLabel text-brand capitalize mt-1">
          {order.status}
        </Text>
        <Text className="textDetail text-brand-text">£{order.total}</Text>
        <Text className="textLabel text-brand-text  mb-2">Items</Text>
      </>

      <ScrollView className="flex-1">
        {order.order_items.map((item) => (
          <View
            key={item.id}
            className="flex-row justify-between py-2 border-b border-brand-border"
          >
            <Image
              source={{
                uri: item.products.image_url
                  ? item.products.image_url
                  : `https://placehold.co/112x112/E8D5B7/C4A882?text=${encodeURIComponent(item.products.name.charAt(0))}`,
              }}
              resizeMode="cover"
              className="w-16 h-16 rounded-md"
            />
            <Text className="text-brand-text flex-1">{item.products.name}</Text>
            <Text className="text-brand-text text-sm">x{item.quantity}</Text>
            <Text className="text-brand-text text-sm w-14 text-right">
              £{item.price_at_order_time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {
        //TODO: Change Style
      }
      <View className="flex-row items-center">
        <ContinueButton
          label="Decline"
          onPress={() => {}}
          iconRight={false}
          className="flex-1 bg-brand-muted border-2  border-brand-border"
        ></ContinueButton>
        <ContinueButton
          label="Proceed"
          onPress={() => {}}
          iconRight={false}
          className="flex-1"
        ></ContinueButton>
      </View>
    </View>
  );
}

export default function StaffDashboard() {
  const [filter, setFilter] = useState<OrderFilter>("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading, isError } = useOrders(filter);

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId) ?? null;

  return (
    <StaffGuard>
      <View className="flex-1 bg-brand-bg">
        {/* Filter bar — spans full width above both columns */}
        <FilterBar
          active={filter}
          onChange={(f) => {
            setFilter(f);
            setSelectedOrderId(null);
          }}
        />

        {/* Two-column body */}
        <View className="flex-1 flex-row">
          {/* Left — order list */}
          <View className="flex-[1] rounded-md border-r border-brand-bg">
            {isLoading && (
              <ActivityIndicator color="#F59E0B" className="mt-8" />
            )}
            {isError && (
              <Text className="text-red-400 text-sm p-4">
                Failed to load orders
              </Text>
            )}
            {!isLoading && !isError && orders?.length === 0 && (
              <Text className="text-brand-text text-sm p-4">No orders</Text>
            )}
            <FlatList
              data={orders}
              keyExtractor={(o) => o.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <OrderListItem
                  order={item}
                  isSelected={item.id === selectedOrderId}
                  onPress={() => setSelectedOrderId(item.id)}
                />
              )}
            />
          </View>

          {/* Right — order detail */}
          <View className="flex-[3]">
            {selectedOrder ? (
              <OrderDetail order={selectedOrder} />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-brand-text text-sm">Select an order</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </StaffGuard>
  );
}
