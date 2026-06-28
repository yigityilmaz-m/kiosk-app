import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  BasketSheetContext,
  useBasketSheetValue,
} from "@/features/basket/hooks/useBasketSheet";
import { ProductCard } from "@/features/products/components/ProductCard";
import { BasketSheet } from "@/features/basket/components/BasketSheet";
import { BottomBar } from "@/components/BottomBar";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/products/hooks/useCategories";
import type { Product, Category } from "@/types/database";
import { SubCategoryCard } from "@/features/products/components/SubCategoryCard";
import { MoveLeft } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { router } from "expo-router";

// TODO: Placeholder hero image — swap for real asset later
const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop";
const { height } = Dimensions.get("window");
export default function ProductListingScreen() {
  const sheet = useBasketSheetValue();
  const { data: categories } = useCategories();

  const [selectedMain, setSelectedMain] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<Category | null>(null);

  const mainCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === null) ?? [],
    [categories],
  );

  const subCategories = useMemo(
    () => categories?.filter((c) => c.parent_id === selectedMain?.id) ?? [],
    [categories, selectedMain],
  );

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProducts(selectedSub?.id);

  function handleSelectMain(cat: Category) {
    setSelectedMain(cat);
    setSelectedSub(null);
  }

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedMain) {
      const firstMain = categories.find((c) => c.parent_id === null);
      if (firstMain) setSelectedMain(firstMain);
    }
  }, [categories, selectedMain]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/(customer)/product/${item.id}`)}
    />
  );

  const renderSubCategories = ({ item }: { item: Category }) => (
    <Pressable
      key={item.id}
      className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm mx-1 mb-3"
      onPress={() => setSelectedSub(item)}
    >
      <SubCategoryCard category={item} />
    </Pressable>
  );

  return (
    <BasketSheetContext.Provider value={sheet}>
      <View className="flex-1 bg-[#f8fafc]">
        <View
          className={cn("relative overflow-hidden")}
          style={{ height: height * 0.3 }}
        >
          <Image
            source={{ uri: HEADER_IMAGE }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/50" />

          {/* Hero content */}
          <View className="absolute bottom-0 left-0 right-0 px-5 pb-10">
            <Text className="text-white text-3xl font-black tracking-tight leading-tight">
              DO YOU HAVE ANY{"\n"}ORDER TODAY?
            </Text>
            <Text className="text-white/70 text-xs font-medium tracking-widest mt-1 uppercase">
              Freshly made for you today.
            </Text>
          </View>
        </View>

        {/* ── Main content card ── */}
        <View className="flex-1 flex-row bg-white rounded-t-3xl -mt-8 pt-4">
          {/* ── Sidebar: main categories ── */}
          <View className="w-[76px] bg-gray-50 rounded-t-3xl">
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingVertical: 8, gap: 6 }}
            >
              {mainCategories.map((cat) => {
                const isSelected = selectedMain?.id === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handleSelectMain(cat)}
                    className="mx-2 items-center"
                  >
                    <View
                      className={cn(
                        "w-14 h-14 rounded-2xl overflow-hidden",
                        isSelected
                          ? "border-2 border-amber-500"
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
                      {/* Dark overlay when selected */}
                      {isSelected && (
                        <View className="absolute inset-0 bg-amber-500/20" />
                      )}
                    </View>
                    <Text
                      className={cn(
                        "text-[9px] font-semibold text-center mt-1.5 leading-tight",
                        isSelected ? "text-amber-600" : "text-gray-400",
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

          {/* ── Right content area ── */}
          <View className="flex-1">
            {/* Sub categories grid */}
            {selectedMain && !selectedSub ? (
              <FlatList
                data={subCategories}
                renderItem={renderSubCategories}
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
                    <Text className="text-gray-400 text-sm">
                      No items here yet.
                    </Text>
                  </View>
                }
              />
            ) : (
              /* Back bar when subcategory selected */
              <View className="flex-row px-3 py-2.5 items-center justify-between">
                <Pressable className="p-2" onPress={() => setSelectedSub(null)}>
                  <MoveLeft size={20} color="#374151" strokeWidth={2} />
                </Pressable>
                <Text className="font-bold text-sm text-gray-800 text-center flex-1">
                  {selectedSub?.name}
                </Text>
                {/* Invisible spacer for optical centering */}
                <View className="p-2 opacity-0">
                  <MoveLeft size={20} color="#374151" strokeWidth={2} />
                </View>
              </View>
            )}

            {/* Loading */}
            {selectedSub && isLoading && (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#D97706" />
              </View>
            )}

            {/* Error */}
            {selectedSub && isError && (
              <View className="flex-1 items-center justify-center px-8">
                <Text className="text-gray-400 text-center text-sm">
                  Could not load products. Please try again.
                </Text>
                <Pressable
                  className="bg-gray-900 rounded-2xl py-3 px-6 items-center mt-4"
                  onPress={() => refetch()}
                >
                  <Text className="text-white font-bold text-sm">Retry</Text>
                </Pressable>
              </View>
            )}

            {/* Product grid */}
            {selectedSub && !isLoading && !isError && (
              <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center pt-16">
                    <Text className="text-gray-400 text-sm">
                      No items here yet.
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </View>

      <BottomBar />
      <BasketSheet />
    </BasketSheetContext.Provider>
  );
}
