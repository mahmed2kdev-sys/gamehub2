import apiClient from "./api-client";
import type { Genre } from "../entities/Genre";
import type { FetchResponse } from "../entities/Game";

const getGenres = () => apiClient.get<FetchResponse<Genre>>("/genres");

export default { getGenres };
