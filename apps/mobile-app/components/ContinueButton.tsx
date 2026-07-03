import { MoveRight } from "lucide-react-native";
import { Text, Pressable, ActivityIndicator } from "react-native";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export const ContinueButton = ({
  label = "",
  onPress,
  isLoading = false,
  isDisabled = false,
}: Props) => {
  const disabled = isDisabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "mx-5 mb-6 bg-brand-continue rounded-2xl py-4 flex-row items-center justify-center gap-x-2",
        disabled && "opacity-60",
      )}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text className="textLabel text-white">{label}</Text>
          <MoveRight color="white" strokeWidth={2} />
        </>
      )}
    </Pressable>
  );
};
