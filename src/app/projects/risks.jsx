import { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { api } from "../../services/api";
import {
  Card,
  Choices,
  Empty,
  Feedback,
  Field,
  localDate,
  ResourceState,
  Screen,
} from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";

export default function Risks() {
  const { id } = useLocalSearchParams();
  const project = useResource("/projects/" + id);
  const resource = useResource("/projects/" + id + "/risks");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [date, setDate] = useState(localDate());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const writable =
    project.data &&
    project.data.my_role !== "worker" &&
    !["completed", "archived"].includes(project.data.status);
  async function save(risk) {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + id + "/risks" + (risk ? "/" + risk.id : ""), {
        method: risk ? "PATCH" : "POST",
        body: risk
          ? { status: risk.status === "open" ? "resolved" : "open" }
          : { title, severity, date },
      });
      if (!risk) {
        setShow(false);
        setTitle("");
      }
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Risks">
      <ResourceState resource={resource} />
      <ResourceState resource={project} />
      <Feedback message={error} />
      {writable && !show && (
        <View className="mb-4">
          <PrimaryButton title="+ Add Risk" onPress={() => setShow(true)} />
        </View>
      )}
      {writable && show && (
        <Card>
          <Field
            label="What could affect your project?"
            value={title}
            onChangeText={setTitle}
          />
          <Choices
            label="Severity"
            value={severity}
            onChange={setSeverity}
            options={["low", "medium", "high"]}
          />
          <Field
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
          <PrimaryButton
            title={busy ? "Saving…" : "Save Risk"}
            disabled={busy}
            onPress={() => save()}
          />
          <View className="mt-2">
            <PrimaryButton
              title="Cancel"
              disabled={busy}
              onPress={() => setShow(false)}
            />
          </View>
        </Card>
      )}
      {(resource.data || []).map((risk) => (
        <Card key={risk.id}>
          <Text className="text-lg font-bold text-forest">{risk.title}</Text>
          <Text className="my-3 text-sm capitalize text-stone-500">
            {risk.severity} severity · {risk.status} · {risk.date}
          </Text>
          {writable && (
            <PrimaryButton
              title={risk.status === "open" ? "Mark Resolved" : "Reopen Risk"}
              disabled={busy}
              onPress={() => save(risk)}
            />
          )}
        </Card>
      ))}
      {!resource.loading && !resource.error && resource.data?.length === 0 && (
        <Empty
          title="No risks logged"
          detail="Keep track of issues that could affect the project."
        />
      )}
    </Screen>
  );
}
