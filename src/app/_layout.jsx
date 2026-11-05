import "../global.css";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";

function Routes() {
  const { user, ready } = useAuth();
  if (!ready)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F6EF",
        }}
      >
        <ActivityIndicator color="#287A2B" />
      </View>
    );
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8F6EF" },
        }}
      >
        <Stack.Protected guard={!user} redirectTo="/home">
          <Stack.Screen name="introduction" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(user)} redirectTo="/introduction">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="projects" />
          <Stack.Screen name="support" />
          <Stack.Screen name="invitation" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
