import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import { useAdjustResourceStock } from "@/features/resources/hooks/useAdjustResourceStock";
import { useSetResourceStock } from "@/features/resources/hooks/useSetResourceStock";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types/database";

const QUICK_AMOUNTS = [500, 1000, 5000];
type Mode = "add" | "set";

type Props = {
  resource: Resource | null;
  onClose: () => void;
};

export function AddStockModal({ resource, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState("");
  const adjustStock = useAdjustResourceStock();
  const setStock = useSetResourceStock();

  const visible = resource !== null;
  const parsedAmount = Number(amount);
  const isValid =
    amount.trim().length > 0 &&
    (mode === "add" ? parsedAmount > 0 : parsedAmount >= 0);
  const isPending = adjustStock.isPending || setStock.isPending;

  const handleClose = () => {
    setAmount("");
    setMode("add");
    onClose();
  };

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setAmount("");
  };

  const handleConfirm = () => {
    if (!resource || !isValid) return;

    if (mode === "add") {
      adjustStock.mutate(
        { resourceId: resource.id, delta: parsedAmount },
        { onSuccess: handleClose },
      );
    } else {
      setStock.mutate(
        { resourceId: resource.id, newValue: parsedAmount },
        { onSuccess: handleClose },
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl w-full max-w-sm p-5">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-bold text-neutral-text">
              Adjust Stock
            </Text>
            <Pressable onPress={handleClose} className="p-1">
              <X size={20} color="#374151" />
            </Pressable>
          </View>

          {resource && (
            <Text className="text-neutral-muted text-sm mb-4">
              {resource.name} · currently {resource.current_stock}
              {resource.unit}
            </Text>
          )}

          {/* Mode toggle */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
            <Pressable
              onPress={() => handleModeChange("add")}
              className={cn(
                "flex-1 py-2 rounded-lg items-center",
                mode === "add" && "bg-white",
              )}
            >
              <Text
                className={cn(
                  "text-sm font-medium",
                  mode === "add" ? "text-neutral-text" : "text-neutral-muted",
                )}
              >
                Add Stock
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleModeChange("set")}
              className={cn(
                "flex-1 py-2 rounded-lg items-center",
                mode === "set" && "bg-white",
              )}
            >
              <Text
                className={cn(
                  "text-sm font-medium",
                  mode === "set" ? "text-neutral-text" : "text-neutral-muted",
                )}
              >
                Set Exact Amount
              </Text>
            </Pressable>
          </View>

          {mode === "add" && (
            <View className="flex-row gap-2 mb-4">
              {QUICK_AMOUNTS.map((qty) => (
                <Pressable
                  key={qty}
                  onPress={() => setAmount(String(qty))}
                  className={cn(
                    "flex-1 py-2 rounded-xl border items-center",
                    amount === String(qty)
                      ? "bg-amber-500 border-amber-500"
                      : "bg-white border-brand-border",
                  )}
                >
                  <Text
                    className={cn(
                      "font-medium text-sm",
                      amount === String(qty)
                        ? "text-white"
                        : "text-neutral-text",
                    )}
                  >
                    +{qty}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text className="text-xs text-neutral-muted mb-1.5">
            {mode === "add"
              ? "Or enter a custom amount"
              : `New stock count (${resource?.unit ?? ""})`}
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            returnKeyType="done"
            placeholder={resource ? `Amount in ${resource.unit}` : "Amount"}
            className="border border-brand-border rounded-xl px-3 py-2.5 mb-4 text-neutral-text"
          />

          <Pressable
            onPress={handleConfirm}
            disabled={!isValid || isPending}
            className={cn(
              "rounded-xl py-3 items-center",
              isValid ? "bg-amber-500" : "bg-gray-200",
            )}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                className={cn(
                  "font-semibold",
                  isValid ? "text-white" : "text-gray-400",
                )}
              >
                {mode === "add"
                  ? `Add ${amount || "0"}${resource?.unit ?? ""}`
                  : `Set to ${amount || "0"}${resource?.unit ?? ""}`}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
