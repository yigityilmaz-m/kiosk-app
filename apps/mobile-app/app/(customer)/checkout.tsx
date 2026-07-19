import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { MoveLeft } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/features/auth/schema";

import { useBasketStore } from "@/features/basket/store";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { ContinueButton } from "@/components/ContinueButton";
import BasketItemCard from "@/features/basket/components/BasketItemCard";

export default function CheckoutScreen() {
  const items = useBasketStore((s) => s.items);
  const total = useBasketStore((s) => s.total());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", customerNote: "" },
  });

  const { mutate: createOrder, isPending } = useCreateOrder();

  const onSubmit = (data: CheckoutFormData) => {
    createOrder(
      {
        customerName: data.customerName,
        customerNote: data.customerNote,
      },
      {
        onSuccess: () =>
          router.replace({
            pathname: "/(customer)/confirmation",
            params: { customerName: data.customerName },
          }),
        onError: (error) => {
          console.error("Error creating order:", error);
          toast.error("Oops, something went wrong. Please try again!", {
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
      <View className="px-6 pt-20 pb-4 bg-gray-50 flex-row justify-between items-center gap-3">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MoveLeft size={20} color="#374151" strokeWidth={2} />
        </Pressable>
        <Text className="textTitle text-brand-text justify-self-center ">
          Checkout
        </Text>
        <View className="opacity-0">
          <MoveLeft size={20} strokeWidth={2} />
        </View>
      </View>

      <View className="flex-1 px-4 pb-4 gap-5">
        {/* Order summary — internally scrollable, grows to fill available space */}
        <View className="bg-white rounded-2xl p-4 flex-1 min-h-[140px] relative">
          <Text className="textLabel text-brand-text mb-3">Order Summary</Text>

          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-4"
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => (
              <BasketItemCard
                item={item}
                key={item.basketItemId}
                editable={true}
              ></BasketItemCard>
            ))}
          </ScrollView>

          <View className="h-px bg-gray-100" />

          <View className="flex-row justify-between items-center bg-amber-50 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
            <Text className="textLabel text-brand-text">Total Order</Text>
            <Text className="textTitle text-amber-600">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Customer details — fixed at bottom, does not scroll away */}
        <View className="bg-white rounded-2xl p-4 gap-4">
          <Text className="textLabel text-brand-text">Your Details</Text>

          <View className="gap-1">
            <Text className="textBody text-brand-text">Name</Text>
            <Controller
              control={control}
              name="customerName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="How should we call you?"
                  placeholderTextColor="#9ca3af"
                  className={cn(
                    "border rounded-xl px-4 py-3 border-brand-border",
                    errors.customerName
                      ? "border-red-400"
                      : " focus:border-brand",
                  )}
                  returnKeyType="done"
                />
              )}
            />
            {errors.customerName && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.customerName.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Text className="textBody text-brand-text">
              Note <Text className=" text-brand-muted">(optional)</Text>
            </Text>
            <Controller
              control={control}
              name="customerNote"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Any special requests?"
                  placeholderTextColor="#9ca3af"
                  className={cn(
                    "border rounded-xl px-4 py-3 border-brand-border",
                    errors.customerNote
                      ? "border-red-400"
                      : " focus:border-brand",
                  )}
                  returnKeyType="done"
                />
              )}
            />
            {errors.customerNote && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.customerNote.message}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ContinueButton
        label="place order"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        isDisabled={isPending}
      />
    </KeyboardAvoidingView>
  );
}
