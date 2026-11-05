import { useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import { api } from "../services/api";
import { Choices, Feedback, Field, localDate } from "./Screen";
import { PrimaryButton } from "./ui";

export default function ProjectForm({ project }) {
  const [form, setForm] = useState({
    name: project?.name || "",
    project_type: project?.project_type || "crops",
    measurement_value: project?.measurement_value || "",
    measurement_unit: project?.measurement_unit || "hectares",
    planned_budget: String(project?.planned_budget ?? ""),
    start_date: project?.start_date || localDate(),
    expected_end_date: project?.expected_end_date || "",
    objectives: project?.objectives.join("\n") || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key) => (value) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  function changeType(type) {
    setForm((previous) => ({
      ...previous,
      project_type: type,
      measurement_unit:
        type === "crops"
          ? "hectares"
          : type === "poultry"
            ? "birds"
            : type === "livestock"
              ? "animals"
              : "",
    }));
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      const result = await api(
        project ? "/projects/" + project.id : "/projects",
        {
          method: project ? "PUT" : "POST",
          body: {
            ...form,
            objectives: form.objectives
              .split("\n")
              .map((v) => v.trim())
              .filter(Boolean),
          },
        },
      );
      router.replace({ pathname: "/projects/[id]", params: { id: result.id } });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Text className="mb-5 text-base leading-6 text-stone-500">
        Start with the essentials. You can add tasks, spending and team members
        after saving.
      </Text>
      <Choices
        label="What are you farming?"
        value={form.project_type}
        onChange={changeType}
        options={["crops", "poultry", "livestock", "other"]}
      />
      <Field
        label="Project name"
        value={form.name}
        onChangeText={update("name")}
        placeholder="e.g. My maize farm"
      />
      <Field
        label={
          form.project_type === "crops"
            ? "Farm size"
            : form.project_type === "other"
              ? "Measurement"
              : "Number of animals"
        }
        value={form.measurement_value}
        onChangeText={update("measurement_value")}
        keyboardType="decimal-pad"
      />
      {form.project_type === "crops" ? (
        <Choices
          label="Unit"
          value={form.measurement_unit}
          onChange={update("measurement_unit")}
          options={["hectares", "acres"]}
        />
      ) : form.project_type === "other" ? (
        <Field
          label="Measurement unit"
          value={form.measurement_unit}
          onChangeText={update("measurement_unit")}
          placeholder="e.g. ponds"
        />
      ) : null}
      <Field
        label="Start date"
        value={form.start_date}
        onChangeText={update("start_date")}
        placeholder="YYYY-MM-DD"
      />
      <Field
        label="Expected completion"
        value={form.expected_end_date}
        onChangeText={update("expected_end_date")}
        placeholder="YYYY-MM-DD"
      />
      <Field
        label="Planned budget (₦)"
        value={form.planned_budget}
        onChangeText={update("planned_budget")}
        keyboardType="decimal-pad"
      />
      <Field
        label="Objectives (one per line)"
        value={form.objectives}
        onChangeText={update("objectives")}
        multiline
      />
      <Feedback message={error} />
      <PrimaryButton
        title={busy ? "Saving…" : project ? "Save changes" : "Create Project"}
        onPress={save}
        disabled={busy}
      />
    </>
  );
}
