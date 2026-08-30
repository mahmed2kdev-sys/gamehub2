import { Heading } from "@chakra-ui/react";
import type { GameQuery } from "../entities/GameQuery";

interface Props {
  gameQuery: GameQuery;
}

export default function GameHeading({ gameQuery }: Props) {
  const heading = `${gameQuery.platform?.name ?? ""} ${gameQuery.genre?.name ?? ""} Games`
    .replace(/\s+/g, " ")
    .trim();
  // ponytail: simple join+trim, add "for"/searchText prefix when needed
  return (
    <Heading as="h1" fontSize="4xl" mb={3} textAlign="left" color="var(--text)">
      {heading}
    </Heading>
  );
}
