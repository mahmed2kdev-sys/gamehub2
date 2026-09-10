import { isRouteErrorResponse, Link as RouterLink, useRouteError } from "react-router";
import { Box, Heading, Link, Text } from "@chakra-ui/react";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <Box minH="100svh" w="full" bg={{ _light: "gray.50", _dark: "gray.800" }} color="fg" p={8}>
      <Heading>{isRouteErrorResponse(error) && error.status === 404 ? "404" : "Oops"}</Heading>
      <Text mb={4}>
        {isRouteErrorResponse(error) ? error.statusText : "Something went wrong."}
      </Text>
      <Link asChild>
        <RouterLink to="/">Go home</RouterLink>
      </Link>
    </Box>
  );
}
