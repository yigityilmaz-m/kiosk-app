import { Stack } from "expo-router";
export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#f8fafc",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="product/[id]"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="confirmation"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
