import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Brand from "../components/Brand";
import { PrimaryButton } from "../components/ui";

export default function Introduction() {
  return (
    <ImageBackground
      source={require("../../assets/images/onboarding/farmer.png")}
      style={{ flex: 1, backgroundColor: "#F8F6EF" }}
      imageStyle={{ width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(248,246,239,0.14)",
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
          bounces={false}
        >
          <View className="items-center px-6 pb-6 pt-7">
            <View className="rounded-3xl bg-[#F8F6EF]/90 px-8 py-5">
              <Brand large />
            </View>
          </View>
          <View
            style={{
              backgroundColor: "rgba(12,37,15,0.87)",
              padding: 24,
              paddingBottom: 28,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
            }}
          >
            <Text className="text-center text-3xl font-bold leading-10 text-white">
              Turn your farming plans into real results.
            </Text>
            <Text className="mb-6 mt-3 text-center text-base leading-6 text-[#E0EBD5]">
              A simpler way to plan, track and manage your farm projects.
            </Text>
            <PrimaryButton
              title="Get Started"
              onPress={() => router.push("/welcome")}
            />
            <Pressable
              onPress={() => router.push("/login")}
              accessibilityRole="button"
              className="mt-2 min-h-12 items-center justify-center"
            >
              <Text className="text-sm text-white">
                Already have an account?{" "}
                <Text className="font-bold">Log in</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
