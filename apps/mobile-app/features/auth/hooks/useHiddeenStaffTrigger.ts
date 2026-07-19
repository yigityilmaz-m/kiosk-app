import { useRef } from "react";
import { router } from "expo-router";

const TAP_THRESHOLD = 5;
const TAP_WINDOW_MS = 2000;

export const useHiddenStaffTrigger = () => {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTrigger = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, TAP_WINDOW_MS);

    if (tapCount.current >= TAP_THRESHOLD) {
      tapCount.current = 0;
      router.push("/staff/login");
    }
  };

  return handleTrigger;
};
