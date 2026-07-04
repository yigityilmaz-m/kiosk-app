import { View, Text } from "react-native";
import { StaffGuard } from "@/features/auth/components/StaffGuard";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useEffect } from "react";

function DashboardContent() {
  const { data: orders, isLoading, isError } = useOrders("active");

  useEffect(() => {
    console.log("=== ORDERS ===");
    console.log("isLoading:", isLoading);
    console.log("isError:", isError);
    if (isError) console.log("error");
    if (orders) {
      console.log("count:", orders.length);
      orders.forEach((o) => {
        console.log(
          `[${o.status.toUpperCase()}] ${o.customer_name} — £${o.total} — items: ${o.order_items.length}`,
        );
        o.order_items.forEach((i) => {
          console.log(
            `  • product_id: ${i.product_id}  qty: ${i.quantity}  price: £${i.price_at_order_time}`,
          );
        });
      });
    }
  }, [orders, isLoading, isError]);

  return (
    <View className="flex-1 bg-[#1C1410] items-center justify-center">
      <Text className="text-white text-lg">
        {isLoading
          ? "Loading orders..."
          : `${orders?.length ?? 0} orders loaded — check console`}
      </Text>
      {isError && (
        <Text className="text-red-400 mt-2 text-sm">Error — check console</Text>
      )}
    </View>
  );
}

export default function StaffDashboard() {
  return (
    <StaffGuard>
      <DashboardContent />
    </StaffGuard>
  );
}
