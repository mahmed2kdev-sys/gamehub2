import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { ApiClient } from "../services/api-client";
import type Game from "../entities/Game";

const client = new ApiClient<Game>("/games");

export default function useGame(slug?: string) {
  return useQuery({
    queryKey: ["game", slug],
    queryFn: () => client.get(slug!),
    enabled: !!slug,
    staleTime: ms("24h"),
  });
}
