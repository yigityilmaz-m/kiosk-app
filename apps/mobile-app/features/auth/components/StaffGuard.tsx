import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store";

type Props = { children: React.ReactNode };

export function StaffGuard({ children }: Props) {
  const isStaff = useAuthStore((s) => s.isStaff);

  useEffect(() => {
    if (!isStaff) {
      router.replace("/staff/login");
    }
  }, [isStaff]);

  if (!isStaff) {
    return (
      <View className="flex-1 bg-[#1C1410] items-center justify-center">
        <ActivityIndicator color="#F59E0B" />
      </View>
    );
  }

  return <>{children}</>;
}
