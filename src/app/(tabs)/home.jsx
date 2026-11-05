import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useResource } from "../../hooks/useResource";
import { ProgressBar } from "../../components/ui";
import { Empty, ResourceState } from "../../components/Screen";
export default function Dashboard() {
  const { user } = useAuth();
  const projects = useResource("/projects");
  const tasks = useResource("/tasks");
  const list = projects.data || [];
  const taskList = tasks.data || [];
  const done = taskList.filter((t) => t.status === "completed").length;
  const progress = taskList.length
    ? Math.round((done / taskList.length) * 100)
    : 0;
  const financeProject = list.find(
    (p) =>
      p.my_role !== "worker" && !["archived", "completed"].includes(p.status),
  );
  const projectRoute = (page) =>
    financeProject
      ? { pathname: "/projects/" + page, params: { id: financeProject.id } }
      : "/projects";
  const actions = [
    {
      title: "Add Project",
      icon: "leaf-outline",
      color: "#287A2B",
      background: "#EAF1DF",
      route: "/projects/create",
    },
    {
      title: "Money Spent",
      icon: "wallet-outline",
      color: "#B96C12",
      background: "#FBEDD9",
      route: projectRoute("expenses"),
    },
    {
      title: "View Tasks",
      icon: "clipboard-outline",
      color: "#247FA2",
      background: "#E3F1F6",
      route: "/tasks",
    },
    {
      title: "Risks",
      icon: "warning-outline",
      color: "#A45F55",
      background: "#F8E9E2",
      route: projectRoute("risks"),
    },
  ];
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#F8F6EF" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
      >
        <View className="mb-6 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-farm-light">
            <Ionicons name="person-outline" size={24} color="#173B1B" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-stone-500">Welcome to your farm</Text>
            <Text className="mt-1 text-xl font-bold text-forest">
              {user.name}
            </Text>
          </View>
          <Ionicons name="leaf" size={26} color="#287A2B" />
        </View>
        <ResourceState resource={projects} />
        <ResourceState resource={tasks} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View projects"
          onPress={() => router.navigate("/projects")}
          className="mb-4 flex-row items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4"
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-farm">
            <Ionicons name="leaf-outline" size={27} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-stone-500">Active Projects</Text>
            <Text className="mt-1 text-2xl font-bold text-forest">
              {list.filter((p) => p.status === "active").length}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#173B1B" />
        </Pressable>
        <View className="mb-5 rounded-2xl border border-stone-200 bg-white p-5">
          <Text className="mb-5 text-base font-bold text-forest">
            Project Progress
          </Text>
          <View className="mb-5 flex-row items-center gap-6">
            <View className="h-28 w-28 items-center justify-center rounded-full border-8 border-farm-light">
              <Text className="text-3xl font-bold text-forest">
                {progress}%
              </Text>
              <Text className="text-xs text-stone-500">completed</Text>
            </View>
            <View className="flex-1 gap-3">
              {[
                { label: "Completed", count: done, color: "#287A2B" },
                {
                  label: "In Progress",
                  count: taskList.filter((t) => t.status === "in_progress")
                    .length,
                  color: "#C49A24",
                },
                {
                  label: "Overdue",
                  count: taskList.filter((t) => t.overdue).length,
                  color: "#D05247",
                },
                {
                  label: "To Do",
                  count: taskList.filter((t) => t.status === "todo").length,
                  color: "#A8A29E",
                },
              ].map((item) => (
                <View key={item.label} className="flex-row items-center gap-2">
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: item.color,
                    }}
                  />
                  <Text className="text-xs text-stone-600">
                    {item.count} {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <ProgressBar value={progress} />
          <Text className="mt-3 text-xs leading-5 text-stone-400">
            Based on tasks you can access. Overdue is an indicator, not a
            separate task status.
          </Text>
        </View>
        {!projects.loading && !projects.error && list.length === 0 && (
          <Empty
            title="Ready to grow?"
            detail="Create your first farm project below."
          />
        )}
        <View className="mb-6 flex-row flex-wrap justify-between gap-y-3">
          {actions.map((action) => (
            <Pressable
              key={action.title}
              onPress={() => router.push(action.route)}
              accessibilityRole="button"
              accessibilityLabel={action.title}
              style={{ width: "48%", backgroundColor: action.background }}
              className="min-h-24 items-center justify-center gap-2 rounded-2xl p-4 active:opacity-70"
            >
              <Ionicons name={action.icon} size={29} color={action.color} />
              <Text className="text-sm font-semibold text-forest">
                {action.title}
              </Text>
            </Pressable>
          ))}
        </View>
        {financeProject && (
          <Text className="mb-4 text-xs text-stone-500">
            Money and risk shortcuts open {financeProject.name}. Choose other
            projects from Projects.
          </Text>
        )}
        <ImageBackground
          source={require("../../../assets/images/farms/maize-field.png")}
          imageStyle={{ borderRadius: 20, width: "100%", height: "100%" }}
          style={{ overflow: "hidden", borderRadius: 20 }}
        >
          <View
            style={{
              minHeight: 150,
              backgroundColor: "rgba(17,47,18,0.48)",
              padding: 20,
              justifyContent: "flex-end",
            }}
          >
            <Text className="text-xl font-bold text-white">
              Plan. Manage. Grow.
            </Text>
            <Text className="mt-2 text-sm leading-5 text-white">
              Your next harvest starts with today’s plan.
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}
