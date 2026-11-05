import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ProjectCard from "../../components/ProjectCard";
import { Choices, Empty, ResourceState } from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";
import { useResource } from "../../hooks/useResource";

export default function Projects() {
  const resource = useResource("/projects");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const projects = resource.data || [];
  const visible = projects.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#F8F6EF" }}
    >
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        refreshing={resource.loading}
        onRefresh={resource.reload}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View>
            <Text className="text-3xl font-bold text-forest">My Projects</Text>
            <Text className="mb-5 mt-2 text-base text-stone-500">
              Plan. Manage. Grow.
            </Text>
            <TextInput
              accessibilityLabel="Search projects"
              placeholder="Search your projects"
              value={search}
              onChangeText={setSearch}
              className="mb-4 min-h-14 rounded-2xl border border-stone-200 bg-white px-4 text-base text-forest"
            />
            <Choices
              value={status}
              onChange={setStatus}
              options={["all", "planning", "active", "completed", "archived"]}
            />
            <ResourceState resource={resource} />
          </View>
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() =>
              router.push({
                pathname: "/projects/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          !resource.loading && !resource.error ? (
            <Empty
              title={
                projects.length
                  ? "No matching projects"
                  : "Your next harvest starts here"
              }
              detail={
                projects.length
                  ? "Try another search or status."
                  : "Create a project to start planning your farm."
              }
            />
          ) : null
        }
      />
      <View className="border-t border-stone-200 px-5 pb-3 pt-4">
        <PrimaryButton
          title="+  Create Project"
          onPress={() => router.push("/projects/create")}
        />
      </View>
    </SafeAreaView>
  );
}
