import { Link as RouterLink, useParams } from "react-router";
import { useState } from "react";
import { Button, GridItem, Heading, Image, Link, Spinner, Text } from "@chakra-ui/react";
import useGame from "../hooks/useGame";
import getCroppedImageUrl from "../services/image-url";

export default function GameDetailPage() {
  const { slug } = useParams();
  const { data: game, isLoading, error } = useGame(slug);
  const [expanded, setExpanded] = useState(false);

  if (isLoading)
    return (
      <GridItem gridColumn="1 / -1" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p="4" minH="calc(100svh - 76px)" textAlign="left">
        <Spinner m={8} />
      </GridItem>
    );
  if (error || !game)
    return (
      <GridItem gridColumn="1 / -1" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p="4" minH="calc(100svh - 76px)" textAlign="left">
        <Text color="red.500">{(error as Error)?.message ?? "Game not found."}</Text>
      </GridItem>
    );

  return (
    <GridItem gridColumn="1 / -1" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p="4" minH="calc(100svh - 76px)" textAlign="left">
      <Link asChild mb={4} display="inline-block">
        <RouterLink to="/">← Back</RouterLink>
      </Link>
      <Heading mb={4}>{game.name}</Heading>
      <Image src={getCroppedImageUrl(game.background_image)} alt={game.name} mb={4} />
      {game.description_raw && (
        <>
          <Text whiteSpace="pre-line" lineClamp={expanded ? undefined : 3}>
            {game.description_raw}
          </Text>
          {game.description_raw.length > 300 && (
            <Button colorPalette="yellow" size="sm" mt={2} onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
        </>
      )}
    </GridItem>
  );
}
