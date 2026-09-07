import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import genreService from "../services/genre-service";
import { genres } from "../data/genres";

export default function useGenres() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: genreService.getGenres,
    staleTime: ms("24h"),
    initialData: { count: genres.length, results: genres },
  });
  return { genres: data.results, error: error ? (error as Error).message : null, isLoading };
}
