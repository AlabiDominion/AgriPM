import { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "../../services/api";
import { useResource } from "../../hooks/useResource";
import {
  Card,
  Choices,
  confirmAction,
  Empty,
  Feedback,
  Field,
  localDate,
  ResourceState,
  Screen,
} from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";

function TaskForm({ project, task, team, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: task?.name || "",
    start_date: task?.start_date || "",
    due_date: task?.due_date || localDate(),
    assignee_id: task?.assignee_id || "",
    status: task?.status || "todo",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api(
        "/projects/" + project.id + "/tasks" + (task ? "/" + task.id : ""),
        {
          method: task ? "PUT" : "POST",
          body: {
            ...form,
            start_date: form.start_date || null,
            assignee_id: form.assignee_id || null,
          },
        },
      );
      await onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card>
      <Text className="mb-4 text-lg font-bold text-forest">
        {task ? "Edit task" : "Add task"}
      </Text>
      <Field
        label="Task name"
        value={form.name}
        onChangeText={update("name")}
      />
      <Field
        label="Start date (optional)"
        value={form.start_date}
        onChangeText={update("start_date")}
        placeholder="YYYY-MM-DD"
      />
      <Field
        label="Due date"
        value={form.due_date}
        onChangeText={update("due_date")}
        placeholder="YYYY-MM-DD"
      />
      <Choices
        label="Assign to"
        value={form.assignee_id}
        onChange={update("assignee_id")}
        options={[
          { value: "", label: "Unassigned" },
          ...(team?.members || []).map((m) => ({ value: m.id, label: m.name })),
        ]}
      />
      <Choices
        label="Status"
        value={form.status}
        onChange={update("status")}
        options={["todo", "in_progress", "completed"]}
      />
      <Feedback message={error} />
      <PrimaryButton
        title={busy ? "Saving…" : "Save Task"}
        disabled={busy}
        onPress={save}
      />
      <View className="mt-2">
        <PrimaryButton title="Cancel" onPress={onCancel} disabled={busy} />
      </View>
    </Card>
  );
}
export default function ProjectTasks() {
  const { id } = useLocalSearchParams();
  const project = useResource("/projects/" + id);
  const resource = useResource("/projects/" + id + "/tasks");
  const team = useResource(
    project.data && project.data.my_role !== "worker"
      ? "/projects/" + id + "/team"
      : null,
  );
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const writable =
    project.data && !["completed", "archived"].includes(project.data.status);
  const manage = writable && project.data.my_role !== "worker";
  async function mutate(task, method, body) {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + id + "/tasks/" + task.id, { method, body });
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Tasks">
      <ResourceState resource={project} />
      <ResourceState resource={resource} />
      <Feedback message={error} />
      {project.data && (
        <Text className="mb-4 text-sm text-stone-500">
          {project.data.name}
          {project.data.my_role === "worker" ? " · Your assigned tasks" : ""}
        </Text>
      )}
      {manage && !showForm && (
        <View className="mb-4">
          <PrimaryButton
            title="+ Add Task"
            onPress={() => {
              setEditing(null);
              setShowForm(true);
            }}
          />
        </View>
      )}
      {manage && showForm && (
        <TaskForm
          key={editing?.id || "new"}
          project={project.data}
          task={editing}
          team={team.data}
          onCancel={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await resource.reload();
          }}
        />
      )}
      {(resource.data || []).map((task) => (
        <Card key={task.id}>
          <Text className="text-base font-bold text-forest">{task.name}</Text>
          <Text className="mt-2 text-xs text-stone-500">
            Due {task.due_date} ·{" "}
            {team.data?.members.find((m) => m.id === task.assignee_id)?.name ||
              (task.assignee_id ? "Assigned" : "Unassigned")}
          </Text>
          {task.overdue && (
            <Text className="mt-2 text-sm font-semibold text-red-700">
              Overdue
            </Text>
          )}
          <View className="mt-4">
            <Choices
              value={task.status}
              disabled={!writable || busy}
              options={["todo", "in_progress", "completed"]}
              onChange={(status) => {
                if (writable && !busy) void mutate(task, "PATCH", { status });
              }}
            />
          </View>
          {manage && (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  title="Edit"
                  disabled={busy}
                  onPress={() => {
                    setEditing(task);
                    setShowForm(true);
                  }}
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  title="Delete"
                  disabled={busy}
                  onPress={() =>
                    confirmAction(
                      "Delete task",
                      "Delete this task? Progress will be recalculated.",
                      () => mutate(task, "DELETE"),
                    )
                  }
                />
              </View>
            </View>
          )}
        </Card>
      ))}
      {!resource.loading && !resource.error && resource.data?.length === 0 && (
        <Empty
          title="No tasks yet"
          detail={
            manage
              ? "Add the first step in your farming plan."
              : "No tasks are assigned to you yet."
          }
        />
      )}
      {!writable && project.data && (
        <Text className="text-sm text-stone-500">
          This project is read-only. The owner can reopen it.
        </Text>
      )}
    </Screen>
  );
}
