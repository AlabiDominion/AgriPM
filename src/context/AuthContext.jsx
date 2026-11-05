import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { api, onUnauthorized, setSessionToken } from "../services/api";

const AuthContext = createContext(null);
const key = "agripm-session";
async function readToken() {
  return Platform.OS === "web"
    ? sessionStorage.getItem(key)
    : SecureStore.getItemAsync(key);
}
async function saveToken(token) {
  if (Platform.OS === "web") {
    if (token) sessionStorage.setItem(key, token);
    else sessionStorage.removeItem(key);
  } else if (token) await SecureStore.setItemAsync(key, token);
  else await SecureStore.deleteItemAsync(key);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  useEffect(() => {
    let alive = true;
    onUnauthorized(() => {
      setSessionToken(null);
      setUser(null);
      void saveToken(null);
    });
    (async () => {
      try {
        const token = await readToken();
        if (token) {
          setSessionToken(token);
          const account = await api("/auth/me");
          if (alive) setUser(account);
        }
      } catch (error) {
        if (alive && error.status !== 401)
          setRestoreError(
            "Could not restore your session. Please reconnect and log in.",
          );
        setSessionToken(null);
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
      onUnauthorized(null);
    };
  }, []);
  async function authenticate(mode, credentials) {
    const result = await api("/auth/" + mode, {
      method: "POST",
      body: credentials,
      authenticated: false,
    });
    if (result.user.role === "admin") {
      setSessionToken(result.token);
      await api("/auth/logout", { method: "POST" });
      setSessionToken(null);
      throw new Error("Use the admin web portal for this account.");
    }
    await saveToken(result.token);
    setSessionToken(result.token);
    setUser(result.user);
    setRestoreError("");
  }
  async function logout() {
    // Revoke on the server before clearing the local token; failure can be retried.
    await api("/auth/logout", { method: "POST" });
    await saveToken(null);
    setSessionToken(null);
    setUser(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, ready, restoreError, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
