import { ApiClient } from "./api-client";
import type { Game } from "../entities/Game";
import type { GameQuery } from "../entities/GameQuery";

const client = new ApiClient<Game>("/games");

const getGames = (gameQuery: GameQuery, signal?: AbortSignal) =>
  client.getAll({
    params: {
      genres: gameQuery.genre?.id,
      parent_platforms: gameQuery.platform?.id,
      ordering: gameQuery.sortOrder || undefined,
      search: gameQuery.searchText || undefined,
    },
    signal,
  });

export default { getGames };
