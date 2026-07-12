import { Tabs } from "expo-router";
import { LayoutDashboard, Package, Boxes } from "lucide-react-native";
import { StaffGuard } from "@/features/auth/components/StaffGuard";
import { BRAND_COLOR } from "@/lib/constants";

export default function StaffTabsLayout() {
  return (
    <StaffGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: BRAND_COLOR.DEFAULT,
          tabBarInactiveTintColor: BRAND_COLOR.muted,
          tabBarStyle: {
            backgroundColor: BRAND_COLOR.bg,
            borderTopColor: BRAND_COLOR.muted,
            borderTopWidth: 2,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <LayoutDashboard size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarIcon: ({ color, size }) => (
              <Package size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            title: "Resources",
            tabBarIcon: ({ color, size }) => (
              <Boxes size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </StaffGuard>
  );
}
