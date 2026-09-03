import { Button, HStack, Image, List, Spinner, Text } from "@chakra-ui/react";
import useGenres from "../hooks/useGenres";
import getCroppedImageUrl from "../services/image-url";
interface Props {
  selectedGenreId?: number;
  onSelectGenre: (genreId: number) => void;
}

export default function GenreList({ selectedGenreId, onSelectGenre }: Props) {
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
              fontWeight={genre.id === selectedGenreId ? "bold" : "normal"}
              onClick={() => onSelectGenre(genre.id)}
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
