import axios, { type AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: { key: import.meta.env.VITE_RAWG_API_KEY },
});

export default {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),
};
