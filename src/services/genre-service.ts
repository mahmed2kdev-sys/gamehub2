import { ApiClient } from "./api-client";
import type { Genre } from "../entities/Genre";

const client = new ApiClient<Genre>("/genres");
const getGenres = () => client.getAll();
export default { getGenres };
