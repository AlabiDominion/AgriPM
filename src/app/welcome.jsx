import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BackHeader, PrimaryButton } from "../components/ui";
import Brand from "../components/Brand";

export default function Welcome() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6EF" }}>
      <BackHeader
        title=""
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 12 }}
      >
        <Text className="mb-4 text-center text-lg font-medium text-forest">
          Welcome to
        </Text>
        <Brand large />
        <Text className="mb-4 mt-5 text-center text-base text-stone-500">
          Let’s get you growing.
        </Text>
        <Image
          source={require("../../assets/images/onboarding/seedling.png")}
          accessibilityLabel="A young seedling growing from the earth"
          style={{ width: "100%", height: 220, borderRadius: 24 }}
          resizeMode="cover"
        />
        <View className="mt-auto pt-7">
          <PrimaryButton
            title="Create a new account"
            onPress={() => router.push("/sign-up")}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/login")}
            className="mt-3 min-h-14 items-center justify-center rounded-2xl bg-[#ECEAE2] px-4"
          >
            <Text className="font-semibold text-forest">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
