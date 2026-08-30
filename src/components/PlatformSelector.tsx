import { NativeSelect, Spinner } from "@chakra-ui/react";
import usePlatforms from "../hooks/usePlatforms";
import type { Platform } from "../entities/Platform";

interface Props {
  selectedPlatform: Platform | null;
  onSelectPlatform: (platform: Platform | null) => void;
}

export default function PlatformSelector({ selectedPlatform, onSelectPlatform }: Props) {
  const { platforms, error, isLoading } = usePlatforms();

  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <NativeSelect.Root size="sm" maxW="200px">
      <NativeSelect.Field borderWidth="0" bg={{ _light: "gray.100", _dark: "whiteAlpha.100" }}
        value={selectedPlatform?.id ?? ""}
        onChange={(e) => {
          const id = e.target.value ? Number(e.target.value) : null;
          const platform = platforms.find((p) => p.id === id) ?? null;
          onSelectPlatform(platform);
        }}
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
