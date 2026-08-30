import { Badge } from "@chakra-ui/react";

interface Props {
  score: number | null;
}

export default function CriticScore({ score }: Props) {
  if (score == null) return null;
  const colorPalette = score > 75 ? "green" : score > 60 ? "yellow" : "red";
  return (
    <Badge colorPalette={colorPalette} variant="subtle" size="sm">
      {score}
    </Badge>
  );
}