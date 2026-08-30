import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

// ponytail: Box wrapper owns borderRadius/overflow; swap to Card.Root props if theme token needed
export default function GameCardContainer({ children }: { children: ReactNode }) {
  return (
    <Box borderRadius={10} overflow="hidden">
      {children}
    </Box>
  );
}
