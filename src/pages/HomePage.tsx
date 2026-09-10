import { GridItem, HStack } from "@chakra-ui/react";
import GameGrid from "../components/GameGrid";
import GameHeading from "../components/GameHeading";
import GenreList from "../components/GenreList";
import PlatformSelector from "../components/PlatformSelector";
import SortSelector from "../components/SortSelector";

export default function HomePage() {
  return (
    <>
      <GridItem gridArea="aside" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p="4" hideBelow="lg">
        <GenreList />
      </GridItem>
      <GridItem gridArea="main" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p="4">
        <GameHeading />
        <HStack mb={4}>
          <PlatformSelector />
          <SortSelector />
        </HStack>
        <GameGrid />
      </GridItem>
    </>
  );
}
