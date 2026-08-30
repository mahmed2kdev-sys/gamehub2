import { useEffect, useState } from "react";
import { CanceledError, type AxiosRequestConfig } from "axios";
import apiClient from "../services/api-client";
import type { FetchResponse } from "../entities/Game";

export function useData<T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: unknown[]) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<FetchResponse<T>>(endpoint, { signal: controller.signal, ...requestConfig })
      .then((res) => setData(res.results))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message ?? "Failed to fetch");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? [endpoint]);

  return { data, error, isLoading };
}
