import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Lock } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError("Invalid email or password.");
      return;
    }

    router.replace("/staff");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-subtle"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-8">
        {/* Icon */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center">
            <Lock size={28} color="#F59E0B" strokeWidth={2} />
          </View>
          <Text className="textHeader text-brand-text mt-4">Staff Login</Text>
          <Text className="textLabel text-brand-text  mt-1">
            Kiosk management
          </Text>
        </View>

        {/* Form */}
        <View className="gap-3">
          <TextInput
            className="bg-brand-bg text-brand-text rounded-xl px-4 py-4 text-base"
            placeholder="Email"
            placeholderTextColor="black"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            className="bg-brand-bg text-brand-text rounded-xl px-4 py-4 text-base"
            placeholder="Password"
            placeholderTextColor="black"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && (
            <Text className="text-red-400 text-sm text-center">{error}</Text>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={cn(
              "bg-brand rounded-xl py-4 items-center justify-center mt-2",
              isLoading && "opacity-60",
            )}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Sign In
              </Text>
            )}
          </Pressable>
        </View>

        {/* Back */}
        <Pressable
          onPress={() => router.dismissAll()}
          className="bg-brand-bg rounded-xl py-4 items-center justify-center mt-2 border-2 border-brand-border"
        >
          <Text className="textLabel text-brand-text">Back to kiosk</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
