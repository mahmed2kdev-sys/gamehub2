import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import type { GameQuery } from "../entities/GameQuery";

interface Props {
  gameQuery: GameQuery;
}

export default function GameGrid({ gameQuery }: Props) {
  const { games, error, isLoading } = useGames(gameQuery);

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} padding="10px">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => (
            <GameCardContainer key={i}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))
        : games.map((game) => (
            <GameCardContainer key={game.id}>
              <GameCard game={game} />
            </GameCardContainer>
          ))}
    </SimpleGrid>
  );
}
