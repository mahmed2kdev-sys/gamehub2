import { SimpleGrid, Text, Button, Box } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import type { GameQuery } from "../entities/GameQuery";

interface Props {
  gameQuery: GameQuery;
}

export default function GameGrid({ gameQuery }: Props) {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGames(gameQuery);

  if (error) return <Text color="red.500">{(error as Error).message}</Text>;

  const games = data?.pages.flatMap((p) => p.results) ?? [];
  const showEndMessage = !isLoading && !hasNextPage && games.length > 0;

  return (
    <>
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
      <Box textAlign="center" mt={6} mb={4}>
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage} loadingText="Loading...">
            Load More
          </Button>
        ) : showEndMessage ? (
          <Text color="fg.muted">Nothing more to load</Text>
        ) : null}
      </Box>
    </>
  );
}
