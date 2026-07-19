import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

type MainCategoryGridProps = {
  categories: Category[];
  selectedMain: Category | null;
  onSelect: (cat: Category) => void;
};

export const MainCategoryGrid = ({
  categories,
  selectedMain,
  onSelect,
}: MainCategoryGridProps) => {
  return (
    <View className="w-[76px] bg-gray-50 rounded-t-3xl">
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingVertical: 8, gap: 6 }}
      >
        {categories.map((cat) => {
          const isSelected = selectedMain?.id === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat)}
              className="mx-2 items-center"
            >
              <View
                className={cn(
                  "w-14 h-14 rounded-2xl overflow-hidden",
                  isSelected
                    ? "border-2 border-brand"
                    : "border-2 border-transparent",
                )}
              >
                <Image
                  source={{
                    uri: cat.image_url
                      ? cat.image_url
                      : `https://placehold.co/112x112/E8D5B7/C4A882?text=${encodeURIComponent(cat.name.charAt(0))}`,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                {isSelected && (
                  <View className="absolute inset-0 bg-brand/10" />
                )}
              </View>
              <Text
                className={cn(
                  "textLabel text-brand-text text-center mt-1.5 leading-tight",
                  isSelected && "text-brand",
                )}
                numberOfLines={2}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
