import { Pressable, Text, View } from "react-native";

export function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={
        disabled
          ? "min-h-14 items-center justify-center rounded-2xl bg-gray-300 px-5"
          : "min-h-14 items-center justify-center rounded-2xl bg-farm px-5 active:opacity-80"
      }
    >
      <Text className="text-base font-bold text-white">{title}</Text>
    </Pressable>
  );
}

export function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <View
      className={
        active
          ? "self-start rounded-full bg-farm-light px-3 py-1"
          : "self-start rounded-full bg-amber-100 px-3 py-1"
      }
    >
      <Text
        className={
          active
            ? "text-xs font-semibold capitalize text-forest"
            : "text-xs font-semibold capitalize text-amber-900"
        }
      >
        {status}
      </Text>
    </View>
  );
}

export function ProgressBar({ value }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: value }}
      className="h-2 overflow-hidden rounded-full bg-stone-100"
    >
      <View
        className="h-full rounded-full bg-farm"
        style={{ width: `${value}%` }}
      />
    </View>
  );
}

export function BackHeader({ title, onBack }) {
  return (
    <View className="flex-row items-center gap-3 px-5 py-3">
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white active:opacity-60"
      >
        <Text className="text-3xl leading-8 text-forest">‹</Text>
      </Pressable>
      <Text className="flex-1 text-lg font-bold text-forest">{title}</Text>
    </View>
  );
}
