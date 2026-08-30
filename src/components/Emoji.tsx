import { Image } from "@chakra-ui/react";
import meh from "../assets/meh.webp";
import thumbsUp from "../assets/thumbs-up.webp";
import bullsEye from "../assets/bulls-eye.webp";

interface Props {
  rating: number;
}

export default function Emoji({ rating }: Props) {
  if (rating < 3) return null;

  const emojiMap: Record<number, { src: string; alt: string; label: string }> = {
    3: { src: meh, alt: "meh", label: "Meh" },
    4: { src: thumbsUp, alt: "thumbs up", label: "Recommended" },
    5: { src: bullsEye, alt: "bullseye", label: "Exceptional" },
  };

  const { src, alt, label } = emojiMap[rating];
  if (!src) return null;

  // ponytail: native title for tooltip, Chakra Tooltip snippet if styled needed
  // ponytail: thumbs-up artwork fills canvas more, render slightly smaller to visually match
  return <Image src={src} alt={alt} title={label} boxSize={rating === 4 ? "20px" : "25px"} objectFit="contain" />;
}
