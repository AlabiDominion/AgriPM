import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { api } from "../../services/api";
import {
  Card,
  Feedback,
  Field,
  ResourceState,
  Screen,
  confirmAction,
} from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";
function FinishForm({ project }) {
  const [achieved, setAchieved] = useState(project.objectives.map(() => false));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function finish() {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + project.id + "/status", {
        method: "PATCH",
        body: {
          status: "completed",
          achieved_objectives: achieved,
          closing_notes: notes,
        },
      });
      router.replace({
        pathname: "/projects/evaluation",
        params: { id: project.id },
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Text className="mb-4 text-base leading-6 text-stone-500">
        Review your objectives. Tap the ones you achieved; unchecked objectives
        will be marked not achieved.
      </Text>
      <Card>
        {project.objectives.map((text, index) => (
          <Pressable
            key={index}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: achieved[index] }}
            onPress={() =>
              setAchieved((values) =>
                values.map((value, i) => (i === index ? !value : value)),
              )
            }
            className="mb-2 min-h-12 flex-row items-center gap-3"
          >
            <View
              className={
                achieved[index]
                  ? "h-6 w-6 items-center justify-center rounded bg-farm"
                  : "h-6 w-6 rounded border border-stone-300"
              }
            >
              {achieved[index] && <Text className="text-white">✓</Text>}
            </View>
            <Text className="flex-1 text-sm text-forest">{text}</Text>
          </Pressable>
        ))}
      </Card>
      {project.completed_tasks < project.total_tasks && (
        <Text className="mb-4 text-sm text-amber-800">
          Some tasks are unfinished. The evaluation will show the actual
          completion percentage.
        </Text>
      )}
      <Field
        label="Closing notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Feedback message={error} />
      <PrimaryButton
        title={busy ? "Finishing…" : "Finish Project"}
        disabled={busy}
        onPress={() =>
          confirmAction(
            "Finish project",
            "Generate the evaluation and make this project read-only? You can reopen it later.",
            finish,
          )
        }
      />
    </>
  );
}
export default function Finish() {
  const { id } = useLocalSearchParams();
  const resource = useResource("/projects/" + id);
  return (
    <Screen title="Finish Project">
      <ResourceState resource={resource} />
      {resource.data?.my_role === "owner" && (
        <FinishForm project={resource.data} />
      )}
    </Screen>
  );
}
