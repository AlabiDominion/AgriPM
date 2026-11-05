import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Brand({ large = false }) {
  return (
    <View className="items-center">
      <View
        className={
          large
            ? "mb-3 h-16 w-16 items-center justify-center rounded-3xl bg-farm"
            : "mb-2 h-12 w-12 items-center justify-center rounded-2xl bg-farm"
        }
      >
        <Ionicons name="leaf" size={large ? 38 : 28} color="white" />
      </View>
      <Text
        className={
          large
            ? "text-4xl font-bold tracking-tight text-forest"
            : "text-3xl font-bold tracking-tight text-forest"
        }
      >
        AgriPM
      </Text>
      <Text className="mt-1 text-sm text-stone-600">Plan. Manage. Grow.</Text>
    </View>
  );
}
