import { View, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ConfirmationScreen() {
  const { customerName } = useLocalSearchParams<{ customerName: string }>();

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-8 gap-6">
      {/* Icon */}
      <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center">
        <Text className="text-5xl">✓</Text>
      </View>

      {/* Message */}
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold text-gray-900">Order Placed!</Text>
        <Text className="text-sm text-gray-400 text-center">
          Your order has been received and is being prepared.
        </Text>
      </View>

      {/* Order number */}
      <View className="bg-white rounded-2xl px-8 py-4 items-center gap-1 shadow-sm">
        <Text className="text-xs font-medium text-gray-400 tracking-widest uppercase">
          Order Name
        </Text>
        <Text className="text-4xl font-bold text-gray-900 tracking-widest">
          {customerName}
        </Text>
      </View>

      <Text className="text-sm text-gray-400 text-center">
        We&apos;ll call your name when it&apos;s ready.
      </Text>

      {/* Back to menu */}
      <Pressable
        className="bg-gray-900 rounded-2xl py-4 px-10 items-center mt-4"
        onPress={() => router.replace("/(customer)")}
        //TODO: pop all the way back to menu instead of replace
      >
        <Text className="text-white font-bold text-base">Back to Menu</Text>
      </Pressable>
    </View>
  );
}
