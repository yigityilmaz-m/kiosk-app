import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useResources } from "@/features/resources/hooks/useResources";
import { AddStockModal } from "@/features/resources/components/AddStockModal";
import type { Resource } from "@/types/database";
import ResourceCard from "@/features/resources/components/ResourceCard";

export default function ResourcesScreen() {
  const { data: resources, isLoading, isError } = useResources();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-neutral-text">Resources</Text>
        <Text className="text-neutral-muted text-sm mt-0.5">
          Stock levels update automatically as orders complete
        </Text>
      </View>

      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#F59E0B" />
        </View>
      )}

      {isError && (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-neutral-muted text-center">
            Couldn&apos;t load resources.
          </Text>
        </View>
      )}

      {resources && (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              onAddStock={() => setSelectedResource(item)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text className="text-neutral-muted text-center mt-8">
              No resources set up yet.
            </Text>
          }
        />
      )}

      <AddStockModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </SafeAreaView>
  );
}
