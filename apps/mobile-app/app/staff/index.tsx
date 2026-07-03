import { StaffGuard } from "@/features/auth/components/StaffGuard";
import { View } from "react-native";

export default function StaffIndex() {
  return (
    <StaffGuard>
      <View className="flex-1 bg-red-400" />
    </StaffGuard>
  );
}
