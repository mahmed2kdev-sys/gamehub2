import { genres } from "../data/genres";

export default function useGenres() {
  return { genres, error: null as string | null, isLoading: false } as const;
}
