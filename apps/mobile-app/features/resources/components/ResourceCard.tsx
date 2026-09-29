import { View, Text, Pressable } from "react-native";
import React from "react";
import { Resource } from "@shared/types/database";
import { PackagePlus, TriangleAlert } from "lucide-react-native";
import { cn } from "@/lib/utils";

type ResourceCardProps = {
  resource: Resource;
  onAddStock: () => void;
};

const ResourceCard = ({ resource, onAddStock }: ResourceCardProps) => {
  const isLow = resource.current_stock <= resource.low_stock_threshold;

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-brand-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-semibold text-neutral-text">
              {resource.name}
            </Text>
            {isLow && <TriangleAlert size={14} color="#DC2626" />}
          </View>
          <Text
            className={cn(
              "text-sm mt-0.5",
              isLow ? "text-red-600" : "text-neutral-muted",
            )}
          >
            {resource.current_stock}
            {resource.unit} remaining
          </Text>
        </View>

        <Pressable
          onPress={onAddStock}
          className="flex-row items-center gap-1.5 bg-amber-500 px-3 py-2 rounded-full"
        >
          <PackagePlus size={16} color="#FFFFFF" />
          <Text className="text-white text-sm font-medium">Add Stock</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ResourceCard;
