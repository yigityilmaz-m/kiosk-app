import { Category } from "@/types/database";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = { category: Category };

export const SubCategoryCard = ({ category }: Props) => {
  return (
    <View
      key={category.id}
      className="flex-1 bg-white rounded-2xl shadow-card mx-1 mb-3"
      style={{ elevation: 3 }}
    >
      {/* Product image */}
      {category.image_url ? (
        <Image
          source={{ uri: category.image_url }}
          className="w-full h-32"
          resizeMode="contain"
        />
      ) : (
        <View className="w-full h-32 bg-gray-100 items-center justify-center">
          <Text className="text-3xl">☕</Text>
        </View>
      )}

      {/* Info */}
      <View className="p-3 gap-2">
        <Text
          className="textLabel text-brand-muted leading-tight text-center"
          numberOfLines={2}
        >
          {category.name}
        </Text>
      </View>
    </View>
  );
};
