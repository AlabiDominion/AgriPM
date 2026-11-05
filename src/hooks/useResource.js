import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { api } from "../services/api";

export function useResource(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const reload = useCallback(async () => {
    if (!path) {
      setLoading(false);
      return;
    }
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const value = await api(path);
      if (request === generation.current) setData(value);
    } catch (failure) {
      if (request === generation.current) setError(failure.message);
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [path]);
  useFocusEffect(
    useCallback(() => {
      void reload();
      return () => {
        generation.current++;
      };
    }, [reload]),
  );
  return { data, error, loading, reload };
}
