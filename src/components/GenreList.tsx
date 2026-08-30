import { Button, HStack, Image, List, Spinner, Text } from "@chakra-ui/react";
import useGenres from "../hooks/useGenres";
import getCroppedImageUrl from "../services/image-url";
import type { Genre } from "../entities/Genre";

interface Props {
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre) => void;
}

export default function GenreList({ selectedGenre, onSelectGenre }: Props) {
  const { genres, error, isLoading } = useGenres();

  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <List.Root listStyle="none">
      {genres.map((genre) => (
        <List.Item key={genre.id} paddingY="5px">
          <HStack>
            <Image
              boxSize="32px"
              borderRadius={8}
              src={getCroppedImageUrl(genre.image_background)}
              alt={genre.name}
            />
            <Button
              variant="ghost"
              justifyContent="flex-start"
              fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
              onClick={() => onSelectGenre(genre)}
            >
              <Text fontSize="lg">{genre.name}</Text>
            </Button>
          </HStack>
        </List.Item>
      ))}
    </List.Root>
  );
}

// ponytail: no deselect toggle, add `if (selected===clicked) onSelect(null)` when needed
