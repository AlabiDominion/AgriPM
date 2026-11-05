import { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Field, Feedback } from "../components/Screen";
import { PrimaryButton } from "../components/ui";
import { api } from "../services/api";
export default function Invitation() {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function accept() {
    setBusy(true);
    setError("");
    try {
      const result = await api("/invitations/accept", {
        method: "POST",
        body: { token: token.trim() },
      });
      router.replace({
        pathname: "/projects/[id]",
        params: { id: result.project_id },
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Team invitation">
      <Text className="mb-5 text-sm leading-6 text-stone-500">
        Sign in with the email address that received the invitation, then paste
        its code below.
      </Text>
      <Field label="Invitation code" value={token} onChangeText={setToken} />
      <Feedback message={error} />
      <PrimaryButton
        title={busy ? "Accepting…" : "Accept Invitation"}
        disabled={busy}
        onPress={accept}
      />
    </Screen>
  );
}
