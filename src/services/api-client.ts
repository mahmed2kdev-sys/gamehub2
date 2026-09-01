import axios, { type AxiosRequestConfig } from "axios";
import type { FetchResponse } from "../entities/Game";

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
  params: { key: import.meta.env.VITE_RAWG_API_KEY },
});

export class ApiClient<T> {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config?: AxiosRequestConfig) =>
    axiosInstance.get<FetchResponse<T>>(this.endpoint, config).then((res) => res.data);

  get = (id: number | string) =>
    axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);
}
// ponytail: only get/getAll, add post/put/delete when write needed
export default ApiClient;
