import { useInfiniteQuery } from "@tanstack/react-query";
import gameService from "../services/game-service";
import type { GameQuery } from "../entities/GameQuery";

export default function useGames(gameQuery: GameQuery) {
  return useInfiniteQuery({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam, signal }) => gameService.getGames(gameQuery, pageParam as number, signal),
    initialPageParam: 1,
    staleTime: 24 * 60 * 60 * 1000,
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),
  });
}
