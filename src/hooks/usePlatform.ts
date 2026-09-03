import usePlatforms from "./usePlatforms";

/**
 * Lookup a single Platform by id from cached `usePlatforms` list.
 * @param id - platformId from GameQuery (undefined = no filter)
 * @returns Platform | undefined — undefined if not found or no id
 * @example const platform = usePlatform(gameQuery.platformId)
 */
export default function usePlatform(id?: number) {
  const { platforms } = usePlatforms();
  // ponytail: linear scan, n≈14, Map if n>>100
  return platforms.find((p) => p.id === id);
}
