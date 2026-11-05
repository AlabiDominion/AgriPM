import { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { api } from "../../services/api";
import {
  Card,
  Choices,
  confirmAction,
  Empty,
  Feedback,
  Field,
  localDate,
  money,
  ResourceState,
  Screen,
} from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";

function ExpenseForm({ id, expense, onSaved, onCancel }) {
  const [form, setForm] = useState({
    amount: String(expense?.amount ?? ""),
    purpose: expense?.purpose || "",
    date: expense?.date || localDate(),
    category: expense?.category || "Other",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api(
        "/projects/" + id + "/expenses" + (expense ? "/" + expense.id : ""),
        { method: expense ? "PUT" : "POST", body: form },
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
        {expense ? "Correct expense" : "Add expense"}
      </Text>
      <Field
        label="Amount (₦)"
        value={form.amount}
        onChangeText={update("amount")}
        keyboardType="decimal-pad"
      />
      <Field
        label="What was it for?"
        value={form.purpose}
        onChangeText={update("purpose")}
      />
      <Field
        label="Date"
        value={form.date}
        onChangeText={update("date")}
        placeholder="YYYY-MM-DD"
      />
      <Choices
        label="Category"
        value={form.category}
        onChange={update("category")}
        options={[
          "Seeds",
          "Fertilizer",
          "Labour",
          "Equipment",
          "Transport",
          "Other",
        ]}
      />
      <Field
        label="Category (or enter your own)"
        value={form.category}
        onChangeText={update("category")}
      />
      <Feedback message={error} />
      <PrimaryButton
        title={busy ? "Saving…" : "Save Expense"}
        disabled={busy}
        onPress={save}
      />
      <View className="mt-2">
        <PrimaryButton title="Cancel" disabled={busy} onPress={onCancel} />
      </View>
    </Card>
  );
}
export default function Expenses() {
  const { id } = useLocalSearchParams();
  const project = useResource("/projects/" + id);
  const resource = useResource("/projects/" + id + "/expenses");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const canWrite =
    project.data?.my_role === "owner" &&
    !["completed", "archived"].includes(project.data?.status);
  async function refresh() {
    setShow(false);
    await Promise.all([resource.reload(), project.reload()]);
  }
  async function voidExpense(expense) {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + id + "/expenses/" + expense.id, {
        method: "DELETE",
      });
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Money Spent">
      <ResourceState resource={project} />
      <ResourceState resource={resource} />
      <Feedback message={error} />
      {project.data?.my_role !== "worker" && project.data && (
        <Card>
          <Text className="text-sm text-stone-500">Planned budget</Text>
          <Text className="my-2 text-2xl font-bold text-forest">
            {money(project.data.planned_budget)}
          </Text>
          <Text className="text-sm leading-7 text-stone-600">
            Spent: {money(project.data.total_spent)}
            {"\n"}
            {project.data.balance < 0 ? "Over budget: " : "Remaining: "}
            {money(Math.abs(project.data.balance))}
          </Text>
        </Card>
      )}
      {canWrite && !show && (
        <View className="mb-4">
          <PrimaryButton
            title="+ Add Expense"
            onPress={() => {
              setEditing(null);
              setShow(true);
            }}
          />
        </View>
      )}
      {canWrite && show && (
        <ExpenseForm
          key={editing?.id || "new"}
          id={id}
          expense={editing}
          onSaved={refresh}
          onCancel={() => setShow(false)}
        />
      )}
      {(resource.data || []).map((expense) => (
        <Card key={expense.id}>
          <Text className="text-lg font-bold text-forest">
            {money(expense.amount)}
          </Text>
          <Text className="mt-2 text-base text-stone-700">
            {expense.purpose}
          </Text>
          <Text className="my-3 text-xs text-stone-500">
            {expense.category} · {expense.date}
            {expense.voided ? " · Voided" : ""}
          </Text>
          {canWrite && !expense.voided && (
            <View className="flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  title="Correct"
                  disabled={busy}
                  onPress={() => {
                    setEditing(expense);
                    setShow(true);
                  }}
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  title="Void"
                  disabled={busy}
                  onPress={() =>
                    confirmAction(
                      "Void expense",
                      "Remove this expense from totals? Its history will be retained.",
                      () => voidExpense(expense),
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
          title="No spending recorded"
          detail="Expenses you record will appear here."
        />
      )}
    </Screen>
  );
}
