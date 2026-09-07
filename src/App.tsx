import { Grid, GridItem, HStack } from '@chakra-ui/react'
import GameGrid from './components/GameGrid'
import GameHeading from './components/GameHeading'
import GenreList from './components/GenreList'
import NavBar from './components/NavBar'
import PlatformSelector from './components/PlatformSelector'
import SortSelector from './components/SortSelector'

function App() {
  return (
    <Grid
      templateAreas={{
        base: '"nav" "main"',
        lg: '"nav nav" "aside main"',
      }}
      gridTemplateColumns={{ base: '1fr', lg: '300px 1fr' }}
    >
      <GridItem gridArea="nav" bg={{ _light: 'gray.50', _dark: 'gray.800' }} p="4">
        <NavBar />
      </GridItem>
      <GridItem gridArea="aside" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4" hideBelow="lg">
        <GenreList />
      </GridItem>
      <GridItem gridArea="main" bg={{ _light: 'gray.50', _dark: 'gray.800' }} color="fg" p="4">
        <GameHeading />
        <HStack mb={4}>
          <PlatformSelector />
          <SortSelector />
        </HStack>
        <GameGrid />
      </GridItem>
    </Grid>
  )
}

export default App
