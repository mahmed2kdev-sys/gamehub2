import { useEffect } from "react";
import { SimpleGrid, Text, Box, Spinner, Button } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import useGames from "../hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import type { GameQuery } from "../entities/GameQuery";

interface Props {
  gameQuery: GameQuery;
}

export default function GameGrid({ gameQuery }: Props) {
  const { data, error, isLoading, fetchNextPage, hasNextPage } = useGames(gameQuery);

  const games = data?.pages.flatMap((p) => p.results) ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameQuery]);

  if (isLoading)
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} padding="10px">
        {Array.from({ length: 6 }).map((_, i) => (
          <GameCardContainer key={i}>
            <GameCardSkeleton />
          </GameCardContainer>
        ))}
      </SimpleGrid>
    );

  if (error && games.length === 0) return <Text color="red.500">{(error as Error).message}</Text>;

  if (games.length === 0) return <Text>No games found.</Text>;

  return (
    <>
      <InfiniteScroll
        dataLength={games.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        hasChildren
        loader={
          <Box textAlign="center" py={4} role="status" aria-live="polite">
            <Spinner aria-label="Loading more games" />
          </Box>
        }
      endMessage={
        <Text textAlign="center" color="fg.muted" mt={6}>
          Nothing more to load
        </Text>
      }
      scrollThreshold="200px"
    >
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} padding="10px">
        {games.map((game) => (
          <GameCardContainer key={game.id}>
            <GameCard game={game} />
          </GameCardContainer>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
    {error && games.length > 0 && (
      <Box textAlign="center" mt={4}>
        <Text color="red.500">Failed to load more.</Text>
        <Button mt={2} onClick={() => fetchNextPage()}>
          Retry
        </Button>
      </Box>
    )}
    </>
  );
}
