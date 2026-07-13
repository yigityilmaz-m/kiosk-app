import { BRAND_COLOR } from "@/lib/constants";
import { Stack } from "expo-router";

export default function StaffLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: BRAND_COLOR.bg },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Staff Dashboard",
        }}
      />
    </Stack>
  );
}
