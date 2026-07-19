import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { cn } from "@/lib/utils";

// TODO: Placeholder app image — swap for real asset later
const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop";

const { height } = Dimensions.get("window");

type HeroHeaderProps = {
  onHiddenTrigger: () => void;
};

export const AppHeader = ({ onHiddenTrigger }: HeroHeaderProps) => {
  return (
    <Pressable
      className={cn("relative overflow-hidden")}
      style={{ height: height * 0.3 }}
      onPress={onHiddenTrigger}
    >
      <Image
        source={{ uri: HEADER_IMAGE }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/50" />

      <View className="absolute bottom-0 left-0 right-0 px-5 pb-10">
        <Text className="text-white text-3xl font-black tracking-tight leading-tight">
          DO YOU HAVE ANY{"\n"}ORDER TODAY?
        </Text>
        <Text className="text-white/70 text-xs font-medium tracking-widest mt-1 uppercase">
          Freshly made for you today.
        </Text>
      </View>
    </Pressable>
  );
};
