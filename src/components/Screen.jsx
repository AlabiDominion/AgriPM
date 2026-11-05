import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackHeader, PrimaryButton } from "./ui";

export function Screen({ title, children, back = true }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6EF" }}>
      {back ? (
        <BackHeader
          title={title}
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace("/home")
          }
        />
      ) : (
        <Text className="px-5 pb-2 pt-5 text-3xl font-bold text-forest">
          {title}
        </Text>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
  secureTextEntry = false,
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-forest">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A29E"
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={
          label.toLowerCase().includes("email") || secureTextEntry
            ? "none"
            : "sentences"
        }
        textAlignVertical={multiline ? "top" : "center"}
        className={
          multiline
            ? "min-h-28 rounded-2xl border border-stone-200 bg-white p-4 text-base text-forest"
            : "min-h-14 rounded-2xl border border-stone-200 bg-white px-4 text-base text-forest"
        }
      />
    </View>
  );
}
export function Choices({ label, options, value, onChange, disabled = false }) {
  return (
    <View className="mb-5">
      {Boolean(label) && (
        <Text className="mb-2 text-sm font-semibold text-forest">{label}</Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option.replaceAll("_", " ") }
              : option;
          const selected = value === item.value;
          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onChange(item.value)}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
              className={
                selected
                  ? "min-h-11 justify-center rounded-full bg-farm px-4"
                  : "min-h-11 justify-center rounded-full border border-stone-200 bg-white px-4"
              }
            >
              <Text
                className={
                  selected
                    ? "text-sm font-semibold capitalize text-white"
                    : "text-sm capitalize text-stone-600"
                }
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
export function Feedback({ message, success = false }) {
  if (!message) return null;
  return (
    <View
      accessibilityRole="alert"
      className={
        success
          ? "mb-4 rounded-xl bg-farm-light p-4"
          : "mb-4 rounded-xl bg-red-50 p-4"
      }
    >
      <Text
        className={
          success
            ? "text-sm leading-6 text-forest"
            : "text-sm leading-6 text-red-800"
        }
      >
        {message}
      </Text>
    </View>
  );
}
export function ResourceState({ resource }) {
  if (resource.error)
    return (
      <View className="my-4">
        <Feedback message={resource.error} />
        <PrimaryButton title="Try again" onPress={resource.reload} />
      </View>
    );
  if (resource.loading && !resource.data)
    return (
      <ActivityIndicator size="large" color="#287A2B" style={{ margin: 30 }} />
    );
  return null;
}
export function Empty({ title, detail }) {
  return (
    <View className="my-3 items-center rounded-3xl border border-dashed border-stone-300 p-6">
      <Text className="text-lg font-bold text-forest">{title}</Text>
      {Boolean(detail) && (
        <Text className="mt-2 text-center text-sm leading-6 text-stone-500">
          {detail}
        </Text>
      )}
    </View>
  );
}
export function Card({ children }) {
  return (
    <View className="mb-4 rounded-2xl border border-stone-200 bg-white p-5">
      {children}
    </View>
  );
}
export function confirmAction(title, message, action) {
  if (Platform.OS === "web") {
    if (window.confirm(message)) void action();
  } else
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", style: "destructive", onPress: () => void action() },
    ]);
}
export function localDate() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}
export function money(value) {
  return (
    "₦" +
    Number(value || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })
  );
}
