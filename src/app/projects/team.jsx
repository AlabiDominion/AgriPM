import { useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useResource } from "../../hooks/useResource";
import { api } from "../../services/api";
import {
  Card,
  Choices,
  confirmAction,
  Feedback,
  Field,
  ResourceState,
  Screen,
} from "../../components/Screen";
import { PrimaryButton } from "../../components/ui";

export default function Team() {
  const { id } = useLocalSearchParams();
  const project = useResource("/projects/" + id);
  const resource = useResource("/projects/" + id + "/team");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("worker");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const owner = project.data?.my_role === "owner";
  async function invite() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api("/projects/" + id + "/invitations", {
        method: "POST",
        body: { email: email.trim(), role },
      });
      setNotice(
        response.delivery === "local_outbox"
          ? "Invitation saved. In this local setup, its code is in backend data/outbox.jsonl; email sending is not configured."
          : response.delivery === "failed"
            ? "Invitation saved, but email delivery failed. Revoke and resend after checking email settings."
            : "Invitation sent by email.",
      );
      setEmail("");
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(path) {
    setBusy(true);
    setError("");
    try {
      await api("/projects/" + id + "/" + path, { method: "DELETE" });
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Project Team">
      <ResourceState resource={resource} />
      <ResourceState resource={project} />
      <Feedback message={error} />
      <Feedback message={notice} success />
      {owner && !["completed", "archived"].includes(project.data.status) && (
        <Card>
          <Text className="mb-4 text-lg font-bold text-forest">
            Invite a member
          </Text>
          <Field
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Choices
            label="Project role"
            value={role}
            onChange={setRole}
            options={[
              { value: "manager", label: "Farm Manager" },
              { value: "worker", label: "Field Worker" },
            ]}
          />
          <Text className="mb-4 text-xs leading-5 text-stone-500">
            Managers manage tasks and risks and view spending. Workers only see
            and update assigned tasks. Invitations expire after 7 days.
          </Text>
          <PrimaryButton
            title={busy ? "Saving…" : "Send Invitation"}
            disabled={busy}
            onPress={invite}
          />
        </Card>
      )}
      {(resource.data?.members || []).map((member) => (
        <Card key={member.id}>
          <Text className="font-bold text-forest">{member.name}</Text>
          <Text className="my-2 text-sm text-stone-500">{member.email}</Text>
          <Text className="mb-3 text-xs capitalize text-farm">
            {member.role}
          </Text>
          {owner && member.role !== "owner" && (
            <PrimaryButton
              title="Remove Access"
              disabled={busy}
              onPress={() =>
                confirmAction(
                  "Remove member",
                  "Immediately remove this person’s project access and unassign their tasks?",
                  () => remove("team/" + member.id),
                )
              }
            />
          )}
        </Card>
      ))}
      {owner &&
        (resource.data?.invitations || []).map((invite) => (
          <Card key={invite.id}>
            <Text className="font-semibold text-forest">{invite.email}</Text>
            <Text className="my-3 text-xs capitalize text-stone-500">
              {invite.role} · {invite.status}
            </Text>
            {invite.status === "pending" && (
              <PrimaryButton
                title="Revoke Invitation"
                disabled={busy}
                onPress={() =>
                  confirmAction(
                    "Revoke invitation",
                    "Revoke this pending invitation?",
                    () => remove("invitations/" + invite.id),
                  )
                }
              />
            )}
          </Card>
        ))}
    </Screen>
  );
}
