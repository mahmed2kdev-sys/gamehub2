import { useQuery } from "@tanstack/react-query";
import genreService from "../services/genre-service";
import { genres } from "../data/genres";

export default function useGenres() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: genreService.getGenres,
    staleTime: 24 * 60 * 60 * 1000,
    initialData: { count: genres.length, results: genres },
  });
  return { genres: data.results, error: error ? (error as Error).message : null, isLoading };
}
