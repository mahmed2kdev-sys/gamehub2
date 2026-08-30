import { useData } from "./useData";
import type { Game } from "../entities/Game";
import type { GameQuery } from "../entities/GameQuery";

export default function useGames(gameQuery: GameQuery) {
  const { data: games, error, isLoading } = useData<Game>(
    "/games",
    { params: { genres: gameQuery.genre?.id, parent_platforms: gameQuery.platform?.id, ordering: gameQuery.sortOrder, search: gameQuery.searchText || undefined } },
    [gameQuery]
  );
  return { games, error, isLoading };
}

export type { Game, FetchGamesResponse } from "../entities/Game";
