import { useState } from "react";
import { Text } from "react-native";
import {
  Screen,
  Field,
  Feedback,
  Card,
  ResourceState,
} from "../components/Screen";
import { PrimaryButton } from "../components/ui";
import { api } from "../services/api";
import { useResource } from "../hooks/useResource";
export default function Support() {
  const resource = useResource("/support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api("/support", { method: "POST", body: { subject, message } });
      setSubject("");
      setMessage("");
      setNotice("Your request has been saved.");
      await resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Help & Support">
      <Text className="mb-5 text-sm leading-6 text-stone-500">
        Describe the issue. Support admins can read what you submit here, but
        cannot open your private project records. Do not include passwords.
      </Text>
      <Field label="Subject" value={subject} onChangeText={setSubject} />
      <Field
        label="How can we help?"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Feedback message={error} />
      <Feedback message={notice} success />
      <PrimaryButton
        title={busy ? "Sending…" : "Send Request"}
        disabled={busy}
        onPress={submit}
      />
      <Text className="mb-4 mt-7 text-lg font-bold text-forest">
        Your requests
      </Text>
      <ResourceState resource={resource} />
      {(resource.data || []).map((item) => (
        <Card key={item.id}>
          <Text className="font-bold text-forest">{item.subject}</Text>
          <Text className="my-2 text-xs capitalize text-farm">
            {item.status.replaceAll("_", " ")}
          </Text>
          <Text className="text-sm leading-6 text-stone-600">
            {item.message}
          </Text>
          {Boolean(item.admin_reply) && (
            <Text className="mt-4 text-sm leading-6 text-forest">
              Support reply: {item.admin_reply}
            </Text>
          )}
        </Card>
      ))}
    </Screen>
  );
}
