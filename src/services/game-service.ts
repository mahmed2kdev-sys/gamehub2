import apiClient from "./api-client";
import type { FetchResponse, Game } from "../entities/Game";
import type { GameQuery } from "../entities/GameQuery";

const getGames = (gameQuery: GameQuery, signal?: AbortSignal) =>
  apiClient.get<FetchResponse<Game>>("/games", {
    params: {
      genres: gameQuery.genre?.id,
      parent_platforms: gameQuery.platform?.id,
      ordering: gameQuery.sortOrder || undefined,
      search: gameQuery.searchText || undefined,
    },
    signal,
  });

export default { getGames };
