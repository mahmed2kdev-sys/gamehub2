import { ApiClient } from "./api-client";
import type { Game } from "../entities/Game";
import type { GameQuery } from "../entities/GameQuery";

const client = new ApiClient<Game>("/games");

const getGames = (gameQuery: GameQuery, page: number, signal?: AbortSignal) =>
  client.getAll({
    params: {
      genres: gameQuery.genreId,
      parent_platforms: gameQuery.platformId,
      ordering: gameQuery.sortOrder || undefined,
      search: gameQuery.searchText || undefined,
      page,
      page_size: 20,
    },
    signal,
  });

export default { getGames };
