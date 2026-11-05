import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { checkHealth } from "../../services/api";
import { Feedback, confirmAction } from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";
export default function More() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function check() {
    setStatus("checking");
    setError("");
    try {
      await checkHealth();
      setStatus("success");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }
  async function signOut() {
    setBusy(true);
    setError("");
    try {
      await logout();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#F8F6EF" }}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="mb-6 text-3xl font-bold text-forest">More</Text>
        <View className="mb-6 rounded-3xl border border-stone-200 bg-white p-6">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-farm-light">
            <Ionicons name="person-outline" size={32} color="#173B1B" />
          </View>
          <Text className="text-xl font-bold text-forest">{user.name}</Text>
          <Text className="mt-2 text-sm text-stone-500">{user.email}</Text>
        </View>
        {[
          { label: "My Projects", icon: "folder-outline", route: "/projects" },
          {
            label: "Team Invitation",
            icon: "people-outline",
            route: "/invitation",
          },
          {
            label: "Help & Support",
            icon: "help-circle-outline",
            route: "/support",
          },
        ].map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route)}
            accessibilityRole="button"
            className="mb-2 min-h-16 flex-row items-center gap-4 rounded-2xl bg-white px-5 py-4"
          >
            <Ionicons name={item.icon} size={23} color="#173B1B" />
            <Text className="flex-1 text-base font-medium text-forest">
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={17} color="#A8A29E" />
          </Pressable>
        ))}
        <View className="my-5 rounded-3xl border border-stone-200 bg-white p-5">
          <Text className="mb-3 text-base font-bold text-forest">
            Backend connection
          </Text>
          <PrimaryButton
            title={status === "checking" ? "Checking…" : "Check Backend"}
            disabled={status === "checking"}
            onPress={check}
          />
          {status === "checking" && (
            <ActivityIndicator color="#287A2B" style={{ marginTop: 12 }} />
          )}
          {status === "success" && (
            <Text
              accessibilityLiveRegion="polite"
              className="mt-4 font-semibold text-farm"
            >
              Backend connected
            </Text>
          )}
        </View>
        <Feedback message={error} />
        <PrimaryButton
          title={busy ? "Signing out…" : "Log Out"}
          disabled={busy}
          onPress={() =>
            confirmAction(
              "Log out",
              "Log out of AgriPM on this device?",
              signOut,
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
