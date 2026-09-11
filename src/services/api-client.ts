import axios, { type AxiosRequestConfig } from "axios";

export interface FetchResponse<T> {
  count: number;
  next?: string | null;
  results: T[];
}

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
