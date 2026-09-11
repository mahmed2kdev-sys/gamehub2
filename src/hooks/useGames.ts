import { useInfiniteQuery } from "@tanstack/react-query";
import ms from "ms";
import gameService from "../services/game-service";
import type GameQuery from "../entities/GameQuery";

export default function useGames(gameQuery: GameQuery) {
  return useInfiniteQuery({
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam, signal }) => gameService.getGames(gameQuery, pageParam as number, signal),
    initialPageParam: 1,
    staleTime: ms("24h"),
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),
  });
}
