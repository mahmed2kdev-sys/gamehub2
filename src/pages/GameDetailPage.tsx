import { Link as RouterLink, useParams } from "react-router";
import { Box, Heading, Image, Link, Spinner, Text } from "@chakra-ui/react";
import useGame from "../hooks/useGame";
import getCroppedImageUrl from "../services/image-url";

export default function GameDetailPage() {
  const { slug } = useParams();
  const { data: game, isLoading, error } = useGame(slug);

  if (isLoading) return <Spinner m={8} />;
  if (error || !game)
    return <Text color="red.500" p={8}>{(error as Error)?.message ?? "Game not found."}</Text>;

  return (
    <Box p={4}>
      <Link asChild mb={4} display="inline-block">
        <RouterLink to="/">← Back</RouterLink>
      </Link>
      <Heading mb={4}>{game.name}</Heading>
      <Image src={getCroppedImageUrl(game.background_image)} alt={game.name} mb={4} />
      {game.description_raw && <Text whiteSpace="pre-line">{game.description_raw}</Text>}
    </Box>
  );
}
