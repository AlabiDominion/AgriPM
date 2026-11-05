import { useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { api } from "../../services/api";
import {
  Card,
  confirmAction,
  Feedback,
  money,
  ResourceState,
  Screen,
} from "../../components/Screen";
import { PrimaryButton, ProgressBar, StatusBadge } from "../../components/ui";
import { projectImage } from "../../components/ProjectCard";

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const resource = useResource("/projects/" + id);
  const project = resource.data;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = (page) =>
    router.push({ pathname: "/projects/" + page, params: { id } });
  async function changeStatus(status) {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + id + "/status", {
        method: "PATCH",
        body: { status },
      });
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Project overview">
      <ResourceState resource={resource} />
      <Feedback message={error} />
      {project && (
        <>
          <ImageBackground
            source={projectImage(project.project_type)}
            imageStyle={{ borderRadius: 24, width: "100%", height: "100%" }}
            style={{ overflow: "hidden", borderRadius: 24 }}
          >
            <View
              style={{
                minHeight: 210,
                justifyContent: "flex-end",
                backgroundColor: "rgba(15,37,13,0.45)",
                padding: 24,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-widest text-white">
                {project.project_type} project
              </Text>
              <Text className="mb-2 mt-2 text-3xl font-bold text-white">
                {project.name}
              </Text>
              <Text className="text-base text-white">
                {project.measurement_value} {project.measurement_unit}
              </Text>
            </View>
          </ImageBackground>
          <View className="my-5 flex-row items-center justify-between">
            <StatusBadge status={project.status} />
            <Text className="text-xs capitalize text-stone-500">
              Your role: {project.my_role}
            </Text>
          </View>
          <Card>
            <View className="mb-4 flex-row justify-between">
              <Text className="font-bold text-forest">Task progress</Text>
              <Text className="font-bold text-farm">{project.progress}%</Text>
            </View>
            <ProgressBar value={project.progress} />
            <Text className="mt-3 text-sm text-stone-500">
              {project.completed_tasks} / {project.total_tasks} completed ·{" "}
              {project.overdue_tasks} overdue
            </Text>
            {project.my_role === "worker" && (
              <Text className="mt-2 text-xs text-stone-500">
                Only your assigned tasks are shown.
              </Text>
            )}
          </Card>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {[
              "tasks",
              ...(project.my_role !== "worker"
                ? ["expenses", "risks", "team"]
                : []),
            ].map((page) => (
              <Pressable
                key={page}
                accessibilityRole="button"
                onPress={() => navigate(page)}
                className="min-h-12 justify-center rounded-xl bg-farm-light px-4"
              >
                <Text className="font-semibold capitalize text-forest">
                  {page === "expenses" ? "Money Spent" : page}
                </Text>
              </Pressable>
            ))}
          </View>
          {project.my_role !== "worker" && (
            <Card>
              <Text className="mb-3 text-lg font-bold text-forest">
                Money overview
              </Text>
              <Text className="text-sm text-stone-500">Planned budget</Text>
              <Text className="mb-4 mt-1 text-2xl font-bold text-forest">
                {money(project.planned_budget)}
              </Text>
              <Text className="text-sm leading-7 text-stone-600">
                Spent: {money(project.total_spent)}
                {"\n"}
                {project.balance < 0 ? "Over budget: " : "Remaining: "}
                {money(Math.abs(project.balance))}
              </Text>
              <Text className="mt-3 text-sm text-stone-500">
                {project.active_risks} unresolved risks
              </Text>
            </Card>
          )}
          <Card>
            <Text className="mb-3 text-lg font-bold text-forest">
              Objectives
            </Text>
            {project.objectives.map((text, i) => (
              <Text key={i} className="mb-2 text-sm leading-6 text-stone-600">
                {i + 1}. {text}
              </Text>
            ))}
            <Text className="mt-3 text-xs text-stone-400">
              {project.start_date} → {project.expected_end_date}
            </Text>
          </Card>
          {project.has_evaluation && project.my_role !== "worker" && (
            <View className="mb-3">
              <PrimaryButton
                title="Evaluation Summary"
                onPress={() => navigate("evaluation")}
              />
            </View>
          )}
          {project.my_role === "owner" && (
            <View className="gap-3">
              {!["completed", "archived"].includes(project.status) && (
                <>
                  <PrimaryButton
                    title="Edit Project"
                    onPress={() => navigate("edit")}
                    disabled={busy}
                  />
                  {project.status === "planning" && (
                    <PrimaryButton
                      title="Start Project"
                      onPress={() => changeStatus("active")}
                      disabled={busy}
                    />
                  )}
                  <PrimaryButton
                    title="Finish Project"
                    onPress={() => navigate("finish")}
                    disabled={busy}
                  />
                </>
              )}
              {["completed", "archived"].includes(project.status) && (
                <PrimaryButton
                  title="Reopen Project"
                  disabled={busy}
                  onPress={() =>
                    confirmAction(
                      "Reopen project",
                      "Reopening removes the previous evaluation snapshot. Continue?",
                      () => changeStatus("active"),
                    )
                  }
                />
              )}
              {project.status !== "archived" && (
                <PrimaryButton
                  title="Archive Project"
                  disabled={busy}
                  onPress={() =>
                    confirmAction(
                      "Archive project",
                      "Archive this project? Its history is retained.",
                      () => changeStatus("archived"),
                    )
                  }
                />
              )}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}
