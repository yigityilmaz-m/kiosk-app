import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { cn } from "@/lib/utils";

import { useBasketStore } from "@/features/basket/store";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";

export default function CheckoutScreen() {
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [nameError, setNameError] = useState(false);

  const items = useBasketStore((s) => s.items);
  const total = useBasketStore((s) => s.total());

  const { mutate: createOrder, isPending } = useCreateOrder();

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);

    createOrder(
      { customerName, customerNote },
      {
        onSuccess: () => {
          router.replace({
            pathname: "/(customer)/confirmation",
            params: { customerName },
          });
        },
        onError: (error) => {
          console.error("Error creating order:", error);
          toast.error("Opps, something went wrong. Please try again!", {
            style: { backgroundColor: "red" },
            duration: 3000,
          });
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="px-4 pt-14 pb-4 bg-gray-50 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text className="text-gray-400 text-base">← Back</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-gray-900">Checkout</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8 gap-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order summary */}
        <View className="bg-white rounded-2xl p-4 gap-3">
          <Text className="text-base font-bold text-gray-900">
            Order Summary
          </Text>

          {items.map((item) => (
            <View
              key={item.product.id}
              className="flex-row justify-between items-center"
            >
              <Text className="text-sm text-gray-600">
                {item.product.name}
                <Text className="text-gray-400"> × {item.quantity}</Text>
              </Text>
              <Text className="text-sm font-semibold text-gray-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View className="h-px bg-gray-100 mt-1" />

          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-gray-900">Total</Text>
            <Text className="text-lg font-bold text-gray-900">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Customer details */}
        <View className="bg-white rounded-2xl p-4 gap-4">
          <Text className="text-base font-bold text-gray-900">
            Your Details
          </Text>

          <View className="gap-1">
            <Text className="text-sm font-medium text-gray-700">
              Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className={cn(
                "border rounded-xl px-4 py-3 text-sm text-gray-900",
                nameError
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50",
              )}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={customerName}
              onChangeText={(v) => {
                setCustomerName(v);
                if (nameError) setNameError(false);
              }}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {nameError && (
              <Text className="text-xs text-red-500">
                Please enter your name
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="text-sm font-medium text-gray-700">
              Note <Text className="text-gray-400 font-normal">(optional)</Text>
            </Text>
            <TextInput
              className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
              placeholder="Any special requests?"
              placeholderTextColor="#9ca3af"
              value={customerNote}
              onChangeText={setCustomerNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>

      {/* Place Order button */}
      <View className="px-4 py-4 bg-gray-50 border-t border-gray-100">
        <Pressable
          className={cn(
            "bg-gray-900 rounded-2xl py-4 items-center justify-center",
            isPending && "opacity-60",
          )}
          onPress={handlePlaceOrder}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base tracking-wide">
              Place Order · ${total.toFixed(2)}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
