import { Heading } from "@chakra-ui/react";
import useGenre from "../hooks/useGenre";
import usePlatform from "../hooks/usePlatform";
import { useGameQueryStore } from "../store/useGameQueryStore";

export default function GameHeading() {
  const genreId = useGameQueryStore((s) => s.gameQuery.genreId);
  const platformId = useGameQueryStore((s) => s.gameQuery.platformId);
  const genre = useGenre(genreId);
  const platform = usePlatform(platformId);
  const heading = `${platform?.name ?? ""} ${genre?.name ?? ""} Games`.replace(/\s+/g, " ").trim();
  // ponytail: simple join+trim, add "for"/searchText prefix when needed
  return (
    <Heading as="h1" fontSize="4xl" mb={3} textAlign="left" color="var(--text)">
      {heading}
    </Heading>
  );
}
