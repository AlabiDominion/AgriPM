import { useState } from "react";
import { router } from "expo-router";
import { Screen, Field, Feedback } from "../components/Screen";
import { PrimaryButton } from "../components/ui";
import { api } from "../services/api";
export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit() {
    setBusy(true);
    setError("");
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: { token: token.trim(), password },
        authenticated: false,
      });
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen title="Reset password">
      <Feedback message={error} />
      {done ? (
        <>
          <Feedback
            message="Password changed. You can now sign in with your new password."
            success
          />
          <PrimaryButton
            title="Log In"
            onPress={() => router.replace("/login")}
          />
        </>
      ) : (
        <>
          <Field label="Reset code" value={token} onChangeText={setToken} />
          <Field
            label="New password (8+ characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <PrimaryButton
            title={busy ? "Saving…" : "Change password"}
            disabled={busy}
            onPress={submit}
          />
        </>
      )}
    </Screen>
  );
}
