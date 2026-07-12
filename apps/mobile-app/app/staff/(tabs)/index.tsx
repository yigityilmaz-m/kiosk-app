import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useOrders, OrderFilter } from "@/features/orders/hooks/useOrders";

import { OrderListItem } from "@/features/orders/components/OrderListItem";
import { OrderDetail } from "@/features/orders/components/OrderDetail";
import { FilterBar } from "@/features/orders/components/FilterBar";

export default function StaffDashboard() {
  const [filter, setFilter] = useState<OrderFilter>("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading, isError } = useOrders(filter);

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId) ?? null;

  return (
    <View className="flex-1 bg-brand-bg">
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
        <View className="flex-[1]">
          {isLoading && <ActivityIndicator color="#F59E0B" className="mt-8" />}
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
  );
}
