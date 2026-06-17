// app/(customer)/confirmation.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderConfirmation() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Order Placed</Text>
      </View>
    </SafeAreaView>
  );
}
