import useGenres from "./useGenres";

/**
 * Lookup a single Genre by id from cached `useGenres` list.
 * @param id - genreId from GameQuery (undefined = no filter)
 * @returns Genre | undefined — undefined if not found or no id
 * @example const genre = useGenre(gameQuery.genreId)
 */
export default function useGenre(id?: number) {
  const { genres } = useGenres();
  // ponytail: linear scan, n≈19, Map if n>>100
  return genres.find((g) => g.id === id);
}
