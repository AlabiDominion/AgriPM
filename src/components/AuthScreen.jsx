import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { BackHeader, PrimaryButton } from "./ui";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

// Shared account form; authentication is handled by AuthContext and FastAPI.
function AuthField({
  label,
  icon,
  value,
  onChangeText,
  password = false,
  email = false,
  error,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-forest">{label}</Text>
      <View
        className={
          error
            ? "min-h-14 flex-row items-center rounded-2xl border border-red-500 bg-white px-4"
            : "min-h-14 flex-row items-center rounded-2xl border border-stone-200 bg-white px-4"
        }
      >
        <Ionicons name={icon} size={19} color="#78716C" />
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#A8A29E"
          autoCapitalize={email || password ? "none" : "words"}
          autoCorrect={false}
          keyboardType={email ? "email-address" : "default"}
          secureTextEntry={password && !showPassword}
          autoComplete={autoComplete}
          className="min-h-14 flex-1 px-3 text-base text-forest"
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            onPress={() => setShowPassword(!showPassword)}
            className="h-11 w-11 items-center justify-center"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color="#78716C"
            />
          </Pressable>
        )}
      </View>
      {Boolean(error) && (
        <Text accessibilityRole="alert" className="mt-2 text-xs text-red-700">
          {error}
        </Text>
      )}
    </View>
  );
}

export default function AuthScreen({ mode }) {
  const { authenticate, restoreError } = useAuth();
  const signup = mode === "signup";
  const reset = mode === "reset";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (field) => (value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setNotice("");
  };
  const title = signup
    ? "Create Account"
    : reset
      ? "Forgot password?"
      : "Welcome back";
  const submit = async () => {
    if (busy) return;
    setNotice("");
    const nextErrors = {};
    if (signup && !form.name.trim())
      nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      nextErrors.email = "Please enter a valid email address.";
    if (!reset && !form.password)
      nextErrors.password = "Please enter your password.";
    if (signup && form.password.length < 8)
      nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    try {
      if (reset) {
        const result = await api("/auth/forgot-password", {
          method: "POST",
          body: { email: form.email.trim() },
          authenticated: false,
        });
        setNotice(result.message);
      } else {
        await authenticate(signup ? "register" : "login", {
          email: form.email.trim(),
          password: form.password,
          ...(signup ? { name: form.name.trim() } : {}),
        });
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6EF" }}>
      <BackHeader
        title=""
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/welcome")
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 10 }}
        >
          <View className="mb-6 h-12 w-12 items-center justify-center rounded-2xl bg-farm-light">
            <Ionicons
              name={reset ? "key-outline" : "leaf"}
              size={27}
              color="#287A2B"
            />
          </View>
          <Text className="text-3xl font-bold tracking-tight text-forest">
            {title}
          </Text>
          <Text className="mb-7 mt-3 text-base leading-6 text-stone-500">
            {signup
              ? "Join a growing community of farmers turning plans into progress."
              : reset
                ? "Enter your account email to request a password reset link."
                : "Your projects, plans and next harvest are waiting for you."}
          </Text>
          {signup && (
            <AuthField
              label="Full name"
              icon="person-outline"
              value={form.name}
              onChangeText={update("name")}
              error={errors.name}
              autoComplete="name"
            />
          )}
          <AuthField
            label="Email address"
            icon="mail-outline"
            value={form.email}
            onChangeText={update("email")}
            error={errors.email}
            autoComplete="email"
            email
          />
          {!reset && (
            <AuthField
              label="Password"
              icon="lock-closed-outline"
              value={form.password}
              onChangeText={update("password")}
              error={errors.password}
              password
              autoComplete={signup ? "new-password" : "current-password"}
            />
          )}
          {!signup && !reset && (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/forgot-password")}
              className="mb-4 min-h-11 items-end justify-center"
            >
              <Text className="text-sm font-semibold text-farm">
                Forgot password?
              </Text>
            </Pressable>
          )}
          <PrimaryButton
            title={
              busy
                ? "Please wait…"
                : signup
                  ? "Create Account"
                  : reset
                    ? "Send reset link"
                    : "Log In"
            }
            onPress={submit}
            disabled={busy}
          />
          {Boolean(notice) && (
            <View
              accessibilityRole="alert"
              className="mt-4 rounded-2xl bg-farm-light p-4"
            >
              <Text className="text-sm leading-6 text-forest">{notice}</Text>
            </View>
          )}
          {Boolean(restoreError) && (
            <Text className="mt-4 text-sm text-red-800">{restoreError}</Text>
          )}
          {reset && (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/reset-password")}
              className="mt-3 min-h-12 items-center justify-center"
            >
              <Text className="font-semibold text-farm">Reset with a code</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.replace(signup || reset ? "/login" : "/sign-up")
            }
            className="mt-3 min-h-12 items-center justify-center"
          >
            <Text className="text-sm text-stone-600">
              {signup
                ? "Already have an account? "
                : reset
                  ? ""
                  : "New to AgriPM? "}
              <Text className="font-bold text-farm">
                {signup || reset ? "Log in" : "Create an account"}
              </Text>
            </Text>
          </Pressable>
          <View className="mt-auto pt-6">
            <Image
              source={require("../../assets/images/onboarding/seedling.png")}
              style={{ width: "100%", height: 135, borderRadius: 24 }}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
