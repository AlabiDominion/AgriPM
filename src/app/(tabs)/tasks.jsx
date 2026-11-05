import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { Choices, Empty, ResourceState } from "../../components/Screen";
export default function Tasks() {
  const resource = useResource("/tasks");
  const [filter, setFilter] = useState("all");
  const visible = (resource.data || []).filter(
    (task) => filter === "all" || task.status === filter,
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
        ListHeaderComponent={
          <View>
            <Text className="text-3xl font-bold text-forest">Tasks</Text>
            <Text className="mb-5 mt-2 text-sm text-stone-500">
              Choose a task to open its project task list.
            </Text>
            <Choices
              value={filter}
              onChange={setFilter}
              options={["all", "todo", "in_progress", "completed"]}
            />
            <ResourceState resource={resource} />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/projects/tasks",
                params: { id: item.project_id },
              })
            }
            className="mb-3 rounded-2xl border border-stone-200 bg-white p-5"
          >
            <Text className="text-base font-bold text-forest">{item.name}</Text>
            <Text className="mt-2 text-xs text-stone-500">
              {item.project_name} · Due {item.due_date}
            </Text>
            <Text className="mt-3 text-sm capitalize text-farm">
              {item.status.replaceAll("_", " ")}
            </Text>
            {item.overdue && (
              <Text className="mt-2 text-xs font-bold text-red-700">
                Overdue
              </Text>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          !resource.loading && !resource.error ? (
            <Empty
              title="No tasks here yet"
              detail="Open a project to add tasks, or wait for your assigned tasks."
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
