import apiClient from "./api-client";
import type { Platform } from "../entities/Platform";
import type { FetchResponse } from "../entities/Game";

const getPlatforms = () => apiClient.get<FetchResponse<Platform>>("/platforms/lists/parents");

export default { getPlatforms };
