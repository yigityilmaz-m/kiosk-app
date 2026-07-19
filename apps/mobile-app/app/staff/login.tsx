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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/features/auth/schema";

export default function LoginScreen() {
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError("Invalid email or password.");
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
          <View className="gap-1">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={cn(
                    "bg-brand-bg text-brand-text rounded-xl px-4 py-4 text-base",
                    errors.password && "border-2 border-red-400",
                  )}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View className="gap-1">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={cn(
                    "bg-brand-bg text-brand-text rounded-xl px-4 py-4 text-base",
                    errors.password && "border-2 border-red-400",
                  )}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-xs">
                {errors.password.message}
              </Text>
            )}
          </View>

          {authError && (
            <Text className="text-red-500 text-sm text-center">
              {authError}
            </Text>
          )}

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={cn(
              "bg-brand rounded-xl py-4 items-center justify-center mt-2",
              isSubmitting && "opacity-60",
            )}
          >
            {isSubmitting ? (
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
