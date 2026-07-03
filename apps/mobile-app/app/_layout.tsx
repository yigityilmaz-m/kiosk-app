import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/store";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { setSession, clearSession } = useAuthStore();

  useEffect(() => {
    // Restore session on launch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        clearSession();
      }
    });

    return () => subscription.unsubscribe();
  }, [clearSession, setSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="staff" />
      </Stack>
      <Toaster />
    </QueryClientProvider>
  );
}
