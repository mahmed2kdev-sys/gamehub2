import { useQuery } from "@tanstack/react-query";
import gameService from "../services/game-service";
import type { GameQuery } from "../entities/GameQuery";

export default function useGames(gameQuery: GameQuery) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["games", gameQuery],
    queryFn: ({ signal }) => gameService.getGames(gameQuery, signal),
  });
  return { games: data?.results ?? [], error: error ? (error as Error).message : null, isLoading };
}
