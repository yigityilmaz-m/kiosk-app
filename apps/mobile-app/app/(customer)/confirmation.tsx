import { View, Text, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { CheckCircle2 } from "lucide-react-native";
export default function ConfirmationScreen() {
  const { customerName } = useLocalSearchParams<{ customerName: string }>();

  return (
    <View className="flex-1 bg-brand-bg items-center justify-center px-8 gap-6">
      <View className="absolute inset-0 ">
        <LottieView
          style={{ width: "100%", height: "80%" }}
          source={require("@/assets/gif/Confetti.json")}
          autoPlay
          speed={0.7}
          loop={false}
        ></LottieView>
      </View>

      {/* Icon */}
      <View className="w-32 h-32 rounded-full bg-brand-subtle items-center justify-center">
        <CheckCircle2 size={48} color="#FF8C00" />
      </View>

      {/* Message */}
      <View className="items-center gap-2">
        <Text className="textTitle text-brand-text">Order Placed!</Text>
        <Text className="textDetail text-brand-muted text-center">
          Your order has been received and is being prepared.
        </Text>
      </View>

      {/* Order number */}
      <View className="bg-white rounded-2xl px-8 py-4 items-center gap-1 shadow-card">
        <Text className="textLabel text-brand-text tracking-widest uppercase">
          Order Name
        </Text>
        <Text className="textHeader tracking-widest">{customerName}</Text>
      </View>

      <Text className="textDetail text-brand-muted text-center">
        We&apos;ll call your name when it&apos;s ready.
      </Text>

      {/* Back to menu */}
      <Pressable
        className="bg-brand-continue rounded-2xl py-4 px-10 items-center mt-4"
        onPress={() => router.dismissAll()}
        //TODO: pop all the way back to menu instead of replace
      >
        <Text className="text-white font-bold text-base">Back to Menu</Text>
      </Pressable>
    </View>
  );
}
