import { Grid, GridItem } from "@chakra-ui/react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";

export default function Layout() {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      gridTemplateColumns={{ base: "1fr", lg: "300px 1fr" }}
      bg={{ _light: "gray.50", _dark: "gray.800" }}
      minH="100svh"
    >
      <GridItem gridArea="nav" bg={{ _light: "gray.50", _dark: "gray.800" }} p="4">
        <NavBar />
      </GridItem>
      <Outlet />
    </Grid>
  );
}
