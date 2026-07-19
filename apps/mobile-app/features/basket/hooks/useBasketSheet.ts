import { createContext, useContext } from "react";
import { useSharedValue, withSpring } from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 60,
  stiffness: 500,
};

type BasketSheetContextType = {
  translateY: SharedValue<number>;
  open: () => void;
  close: () => void;
};

export const BasketSheetContext = createContext<BasketSheetContextType | null>(
  null,
);

export const useBasketSheet = () => {
  const ctx = useContext(BasketSheetContext);
  if (!ctx) {
    throw new Error("useBasketSheet must be used inside BasketSheetProvider");
  }
  return ctx;
};

export const useBasketSheetValue = () => {
  const translateY = useSharedValue<number>(1); // 1 = closed, 0 = open

  const open = () => {
    translateY.value = withSpring(0, SPRING_CONFIG);
  };

  const close = () => {
    translateY.value = withSpring(1, SPRING_CONFIG);
  };

  return { translateY, open, close };
};
