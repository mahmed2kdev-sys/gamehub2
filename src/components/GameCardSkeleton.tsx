import { Card, Skeleton } from "@chakra-ui/react";

export default function GameCardSkeleton() {
  return (
    <Card.Root>
      <Skeleton height="200px" />
      <Card.Body>
        <Skeleton height="20px" />
      </Card.Body>
    </Card.Root>
  );
}
