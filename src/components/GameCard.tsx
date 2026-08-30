import { Card, Image, Text, HStack } from "@chakra-ui/react";
import type { Game } from "../entities/Game";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import Emoji from "./Emoji";
import getCroppedImageUrl from "../services/image-url";

interface Props {
  game: Game;
}

export default function GameCard({ game }: Props) {
  return (
    <Card.Root>
      <Image src={getCroppedImageUrl(game.background_image)} alt={game.name} loading="lazy" />
      <Card.Body>
        <HStack justify="space-between" mb={3}>
          <PlatformIconList platforms={game.parent_platforms} />
          <CriticScore score={game.metacritic} />
        </HStack>
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            {game.name}
          </Text>
          <Emoji rating={game.rating_top} />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
