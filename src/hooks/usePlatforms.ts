import { useQuery } from "@tanstack/react-query";
import platformService from "../services/platform-service";
import { platforms } from "../data/platforms";

export default function usePlatforms() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["platforms"],
    queryFn: platformService.getPlatforms,
    staleTime: 24 * 60 * 60 * 1000,
    initialData: { count: platforms.length, results: platforms },
  });
  return { platforms: data.results, error: error ? (error as Error).message : null, isLoading };
}
