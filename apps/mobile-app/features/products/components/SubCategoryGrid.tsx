import { View, Text, FlatList, Pressable } from "react-native";
import { SubCategoryCard } from "@/features/products/components/SubCategoryCard";
import type { Category } from "@/types/database";

type SubCategoryGridProps = {
  subCategories: Category[];
  onSelect: (cat: Category) => void;
};

export const SubCategoryGrid = ({
  subCategories,
  onSelect,
}: SubCategoryGridProps) => {
  return (
    <FlatList
      data={subCategories}
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm mx-1 mb-3"
          onPress={() => onSelect(item)}
        >
          <SubCategoryCard category={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 96,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center pt-16">
          <Text className="text-gray-400 text-sm">No items here yet.</Text>
        </View>
      }
    />
  );
};
