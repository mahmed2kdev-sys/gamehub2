import { Heading } from "@chakra-ui/react";
import type { GameQuery } from "../entities/GameQuery";
import useGenre from "../hooks/useGenre";
import usePlatform from "../hooks/usePlatform";

interface Props {
  gameQuery: GameQuery;
}

export default function GameHeading({ gameQuery }: Props) {
  const genre = useGenre(gameQuery.genreId);
  const platform = usePlatform(gameQuery.platformId);
  const heading = `${platform?.name ?? ""} ${genre?.name ?? ""} Games`.replace(/\s+/g, " ").trim();
  // ponytail: simple join+trim, add "for"/searchText prefix when needed
  return (
    <Heading as="h1" fontSize="4xl" mb={3} textAlign="left" color="var(--text)">
      {heading}
    </Heading>
  );
}
