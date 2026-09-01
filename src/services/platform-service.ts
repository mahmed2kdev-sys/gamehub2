import { ApiClient } from "./api-client";
import type { Platform } from "../entities/Platform";

const client = new ApiClient<Platform>("/platforms/lists/parents");
const getPlatforms = () => client.getAll();
export default { getPlatforms };
