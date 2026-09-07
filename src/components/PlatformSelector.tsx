import { NativeSelect, Spinner } from "@chakra-ui/react";
import usePlatforms from "../hooks/usePlatforms";
import { useGameQueryStore } from "../store/useGameQueryStore";

export default function PlatformSelector() {
  const selectedPlatformId = useGameQueryStore((s) => s.gameQuery.platformId);
  const setPlatformId = useGameQueryStore((s) => s.setPlatformId);
  const { platforms, error, isLoading } = usePlatforms();

  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <NativeSelect.Root size="sm" maxW="200px">
      <NativeSelect.Field borderWidth="0" bg={{ _light: "gray.100", _dark: "whiteAlpha.100" }}
        value={selectedPlatformId ?? ""}
        onChange={(e) => setPlatformId(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">All Platforms</option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

// ponytail: single-select only, add multi-select when needed
