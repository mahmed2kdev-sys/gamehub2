import { useState } from "react";
import { Grid, GridItem, HStack } from '@chakra-ui/react'
import GameGrid from './components/GameGrid'
import GameHeading from './components/GameHeading'
import GenreList from './components/GenreList'
import NavBar from './components/NavBar'
import PlatformSelector from './components/PlatformSelector'
import SortSelector from './components/SortSelector'
import type { GameQuery } from './entities/GameQuery'

function App() {
  const [gameQuery, setGameQuery] = useState<GameQuery>({ sortOrder: "", searchText: "" })

  return (
    <Grid
      templateAreas={{
        base: '"nav" "main"',
        lg: '"nav nav" "aside main"',
      }}
      gridTemplateColumns={{ base: '1fr', lg: '300px 1fr' }}
    >
      <GridItem gridArea="nav" bg={{ _light: 'gray.50', _dark: 'gray.800' }} p="4">
        <NavBar onSearch={(searchText) => setGameQuery({ ...gameQuery, searchText })} />
      </GridItem>
      <GridItem gridArea="aside" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4" hideBelow="lg">
        <GenreList selectedGenreId={gameQuery.genreId} onSelectGenre={(genreId) => setGameQuery({ ...gameQuery, genreId })} />
      </GridItem>
      <GridItem gridArea="main" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4">
        <GameHeading gameQuery={gameQuery} />
        <HStack mb={4}>
          <PlatformSelector selectedPlatformId={gameQuery.platformId} onSelectPlatform={(platformId) => setGameQuery({ ...gameQuery, platformId })} />
          <SortSelector sortOrder={gameQuery.sortOrder} onSelectSortOrder={(sortOrder) => setGameQuery({ ...gameQuery, sortOrder })} />
        </HStack>
        <GameGrid gameQuery={gameQuery} />
      </GridItem>
    </Grid>
  )
}

export default App
