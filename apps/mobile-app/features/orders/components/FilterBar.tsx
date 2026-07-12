import { OrderFilter } from "../hooks/useOrders";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: OrderFilter }[] = [
  { label: "Active", value: "active" },
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const FilterBar = ({
  active,
  onChange,
}: {
  active: OrderFilter;
  onChange: (f: OrderFilter) => void;
}) => {
  return (
    <View className="flex-row gap-2 p-3">
      {FILTERS.map((f) => (
        <Pressable
          key={f.value}
          onPress={() => onChange(f.value)}
          className={cn(
            "px-4 py-1.5 rounded-full border-2 border-brand-text",
            active === f.value
              ? "bg-amber-500 "
              : "bg-white  border-brand-border ",
          )}
        >
          <Text className={`text-sm font-medium text-brand-text px-1`}>
            {f.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
