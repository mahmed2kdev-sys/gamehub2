import { HStack, Icon } from "@chakra-ui/react";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaAndroid,
  FaLinux,
  FaGlobe,
  FaGamepad,
} from "react-icons/fa";
import type { Game } from "../entities/Game";

const iconMap: Record<string, typeof FaWindows> = {
  pc: FaWindows,
  playstation: FaPlaystation,
  xbox: FaXbox,
  ios: FaApple,
  mac: FaApple,
  android: FaAndroid,
  linux: FaLinux,
  nintendo: FaGamepad,
  web: FaGlobe,
};

export default function PlatformIconList({
  platforms,
}: {
  platforms: Game["parent_platforms"];
}) {
  if (!platforms?.length) return null;
  return (
    <HStack gap={2} mt={2}>
      {platforms.map(({ platform }) => {
        const C = iconMap[platform.slug];
        return C ? <Icon key={platform.id} as={C} color="gray.500" /> : null;
      })}
    </HStack>
  );
}
