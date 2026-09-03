import { Heading } from "@chakra-ui/react";
import type { GameQuery } from "../entities/GameQuery";
import useGenres from "../hooks/useGenres";
import usePlatforms from "../hooks/usePlatforms";

interface Props {
  gameQuery: GameQuery;
}

export default function GameHeading({ gameQuery }: Props) {
  const { genres } = useGenres();
  const { platforms } = usePlatforms();
  const genreName = genres.find((g) => g.id === gameQuery.genreId)?.name ?? "";
  const platformName = platforms.find((p) => p.id === gameQuery.platformId)?.name ?? "";
  const heading = `${platformName} ${genreName} Games`.replace(/\s+/g, " ").trim();
  // ponytail: simple join+trim, add "for"/searchText prefix when needed
  return (
    <Heading as="h1" fontSize="4xl" mb={3} textAlign="left" color="var(--text)">
      {heading}
    </Heading>
  );
}
