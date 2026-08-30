import { platforms } from "../data/platforms";

export default function usePlatforms() {
  return { platforms, error: null as string | null, isLoading: false } as const;
}
