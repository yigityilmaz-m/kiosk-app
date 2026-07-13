import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/store";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const { setSession, clearSession } = useAuthStore();

  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    async function prepare() {
      // Restore auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setSession(session);
      else clearSession();

      // Auth listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) setSession(session);
        else clearSession();
      });

      setAppReady(true);
      return () => subscription.unsubscribe();
    }
    prepare();
  }, [clearSession, setSession]);

  useEffect(() => {
    if (!appReady) return;

    async function animate() {
      await SplashScreen.hideAsync();

      // Logo fades + scales in
      logoOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      logoScale.value = withTiming(1.5, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      });

      // App name fades in shortly after
      textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

      // Whole screen fades out after a beat
      containerOpacity.value = withDelay(
        2000,
        withTiming(0, { duration: 400 }, (finished) => {
          if (finished) runOnJS(setSplashDone)(true);
        }),
      );
    }

    animate();
  }, [appReady, containerOpacity, logoOpacity, logoScale, textOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!splashDone) {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#1C1410",
            alignItems: "center",
            justifyContent: "center",
          },
          containerStyle,
        ]}
      >
        {/* Logo placeholder — replace with your <Image> when ready */}

        <Animated.Image
          source={require("@/assets/logo.png")}
          style={[
            { width: 96, height: 96, borderRadius: 20, marginBottom: 30 },
            logoStyle,
          ]}
        />

        <Animated.Text
          style={[
            {
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: "700",
              letterSpacing: 2,
            },
            textStyle,
          ]}
        >
          KIOSKAPP
        </Animated.Text>

        <Animated.Text
          style={[
            {
              color: "#F59E0B",
              fontSize: 12,
              letterSpacing: 4,
              marginTop: 6,
              textTransform: "uppercase",
            },
            textStyle,
          ]}
        >
          Self-Order Kiosk
        </Animated.Text>
      </Animated.View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="staff" />
      </Stack>
    </QueryClientProvider>
  );
}
