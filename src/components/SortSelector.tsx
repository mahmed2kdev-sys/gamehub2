import { NativeSelect } from "@chakra-ui/react";

interface Props {
  sortOrder: string;
  onSelectSortOrder: (sortOrder: string) => void;
}

export default function SortSelector({ sortOrder, onSelectSortOrder }: Props) {
  const sortOrders = [
    { value: "", label: "Relevance" },
    { value: "-added", label: "Date added" },
    { value: "name", label: "Name" },
    { value: "-released", label: "Release date" },
    { value: "-metacritic", label: "Popularity" },
    { value: "-rating", label: "Average rating" },
  ];

  return (
    <NativeSelect.Root size="sm" maxW="200px">
      <NativeSelect.Field borderWidth="0" bg={{ _light: "gray.100", _dark: "whiteAlpha.100" }} value={sortOrder} onChange={(e) => onSelectSortOrder(e.target.value)}>
        {sortOrders.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
