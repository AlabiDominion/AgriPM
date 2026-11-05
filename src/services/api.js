import { Platform } from "react-native";

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "web"
    ? "http://localhost:8000"
    : "http://192.168.51.91:8000")
).replace(/\/$/, "");
let sessionToken = null;
let unauthorizedHandler = null;
export function setSessionToken(token) {
  sessionToken = token;
}
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

export async function api(
  path,
  { method = "GET", body, authenticated = true } = {},
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(API_URL + path, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(authenticated && sessionToken
          ? { Authorization: "Bearer " + sessionToken }
          : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && authenticated) unauthorizedHandler?.();
      const detail = Array.isArray(data.detail)
        ? data.detail
            .map(
              (error) =>
                `${error.loc?.slice(1).join(".") || "Input"}: ${error.msg}`,
            )
            .join("\n")
        : data.detail;
      const error = new Error(detail || "The request could not be completed.");
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error(
        "The server took too long to respond. Check your connection and try again.",
      );
    if (error instanceof TypeError)
      throw new Error(
        "Cannot reach AgriPM. Check Wi-Fi and make sure the backend is running.",
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
export async function checkHealth() {
  const data = await api("/", { authenticated: false });
  if (data.message !== "ok") throw new Error("Unexpected server response.");
  return data;
}
